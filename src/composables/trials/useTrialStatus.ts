import type { PortalId, Trial, TrialTab } from "@/types";

type ApprovalStatus = "approved" | "pending" | "rejected" | "blocked";

export const lifecycleSteps = [
    "Bavaria Creates",
    "FDA Approval",
    "JH Approval",
    "Bavaria Ship",
    "FDA Assignment",
    "Dosing Complete",
    "JH Results to FDA",
    "FDA Report to Bavaria and JH with De-Anon PII",
] as const;

export interface StatusBadgeDefinition {
    label: string;
    tone:
        | "gray"
        | "green"
        | "blue"
        | "yellow"
        | "orange"
        | "red"
        | "purple"
        | "black"
        | "cyan";
}

export function trialStatusLabel(trial: Trial): string {
    const approvals = approvalsFor(trial);

    if (trial.status === "complete" && trial.disclosed && trial.notifiedFDA)
        return "Completed";
    if (trial.status === "rejected") return "Rejected";

    if (trial.status === "pending-approval") {
        if (approvals.fda === "pending") return "Pending FDA Approval";
        if (approvals.fda === "approved" && approvals.jh === "pending")
            return "Pending JH Approval";
        if (approvals.fda === "approved" && approvals.jh === "blocked")
            return "Awaiting JH Approval";
        if (approvals.fda === "approved" && approvals.jh === "approved") {
            if (trial.batchSubmitted && !trial.assignmentsLocked)
                return "Approved - Awaiting Assignments";
            if (!trial.batchSubmitted) return "Approved - Awaiting Batch";
            return "Approved";
        }
        return "Pending Approval";
    }

    if (trial.notifiedFDA && !trial.disclosed) return "Awaiting FDA Report";
    if (trial.batchSubmitted && !trial.assignmentsLocked)
        return "Approved - Awaiting Assignments";
    if (
        approvals.jh === "approved" &&
        approvals.fda === "approved" &&
        !trial.batchSubmitted
    ) {
        return "Approved - Awaiting Batch";
    }

    return "Active";
}

export function statusBadges(trial: Trial): StatusBadgeDefinition[] {
    const badges: StatusBadgeDefinition[] = [];
    const label = trialStatusLabel(trial);

    if (trial.archived) badges.push({ label: "Archived", tone: "gray" });

    if (trial.status === "complete" && trial.disclosed && trial.notifiedFDA)
        badges.push({ label, tone: "purple" });
    else if (trial.status === "rejected") badges.push({ label, tone: "red" });
    else if (label === "Active") badges.push({ label, tone: "green" });
    else if (label.startsWith("Approved"))
        badges.push({ label, tone: "orange" });
    else badges.push({ label, tone: "yellow" });

    return badges;
}

function approvalsFor(trial: Trial): {
    jh: ApprovalStatus;
    fda: ApprovalStatus;
} {
    return {
        jh: trial.approvals?.jh ?? "blocked",
        fda: trial.approvals?.fda ?? "pending",
    };
}

export function rejectedStepIndex(trial: Trial): number | null {
    if (trial.status !== "rejected") return null;

    const approvals = approvalsFor(trial);
    if (approvals.fda === "rejected") return 1;
    if (approvals.jh === "rejected") return 2;
    if (!trial.batchSubmitted) return 3;
    if (!trial.assignmentsLocked) return 4;
    if (!trial.notifiedFDA) return 6;
    return 7;
}

export function currentLifecycleStepIndex(
    trial: Trial,
    allDosed = false,
): number {
    const approvals = approvalsFor(trial);

    if (trial.disclosed && trial.notifiedFDA) return 7;
    if (trial.notifiedFDA) return 6;
    if (allDosed) return 5;
    if (trial.assignmentsLocked) return 4;
    if (trial.batchSubmitted) return 3;
    if (approvals.jh === "approved" && approvals.fda === "approved") return 2;
    if (approvals.fda === "approved") return 1;
    return 0;
}

export function approvalLabel(value: ApprovalStatus): string {
    return value === "blocked"
        ? "Awaiting FDA"
        : value.charAt(0).toUpperCase() + value.slice(1);
}

export function approvalTone(
    value: ApprovalStatus,
): StatusBadgeDefinition["tone"] {
    if (value === "approved") return "green";
    if (value === "rejected") return "red";
    return "yellow";
}

export function trialApprovals(trial: Trial): {
    jh: ApprovalStatus;
    fda: ApprovalStatus;
} {
    return approvalsFor(trial);
}

export function canApproveTrial(
    trial: Trial,
    portalId: PortalId,
    hasAssignedPatients = true,
): boolean {
    const approvals = trialApprovals(trial);

    if (trial.status === "rejected") return false;
    if (portalId === "jh-admin") {
        return (
            hasAssignedPatients &&
            approvals.jh === "pending" &&
            trial.status === "pending-approval"
        );
    }
    if (portalId === "fda")
        return (
            approvals.fda === "pending" && trial.status === "pending-approval"
        );
    return false;
}

export function canSeePii(portalId: PortalId): boolean {
    return portalId === "jh-doctor" || portalId === "jh-admin";
}

export function canAddPatients(trial: Trial, portalId: PortalId): boolean {
    if (trial.status === "rejected" || trial.notifiedFDA) return false;
    if (portalId === "jh-admin") return true;
    return trial.status === "pending-approval" && portalId === "jh-doctor";
}

export function isTrialCurrent(trial: Trial): boolean {
    return (
        trial.status === "complete" ||
        (trial.status === "active" && Boolean(trial.assignmentsLocked))
    );
}

export function canArchiveTrial(trial: Trial, portalId: PortalId): boolean {
    return (
        portalId === "bavaria" &&
        (trial.status === "complete" || trial.status === "rejected")
    );
}

export function canDeleteArchivedTrial(
    trial: Trial,
    portalId: PortalId,
): boolean {
    return (
        portalId === "bavaria" &&
        trial.status === "rejected" &&
        Boolean(trial.archived)
    );
}

export function getVisibleTabs(trial: Trial, portalId: PortalId): TrialTab[] {
    const tabs: TrialTab[] = ["overview"];

    if (trial.status === "rejected") {
        if (portalId === "jh-admin") tabs.push("patients");
        return tabs;
    }

    const current = isTrialCurrent(trial);
    const finalReportPublished = Boolean(trial.disclosed && trial.notifiedFDA);

    if (portalId === "jh-admin" && trial.status === "pending-approval") {
        tabs.push("patients");
    }

    if ((portalId === "jh-doctor" || portalId === "jh-admin") && current) {
        tabs.push("patients");
        if (portalId === "jh-doctor") tabs.push("appointments", "doses");
        if (portalId === "jh-admin") tabs.push("doses", "notify");
    }

    if (
        (portalId === "jh-admin" || portalId === "jh-doctor") &&
        finalReportPublished
    ) {
        tabs.push("report");
    }

    if (portalId === "fda") {
        if (current) tabs.push("patients");
        tabs.push("assignments", "disclose");
        if (finalReportPublished) tabs.push("report");
    }

    if (portalId === "bavaria") {
        if (current) tabs.push("patients");
        tabs.push("batch");
        if (finalReportPublished) tabs.push("report");
    }

    return tabs;
}

export function needsReview(
    trial: Trial,
    portalId: PortalId,
    allDosed: boolean,
): boolean {
    if (trial.archived || trial.status === "rejected") return false;

    const approvals = trialApprovals(trial);
    const fullyApproved =
        approvals.jh === "approved" && approvals.fda === "approved";

    if (portalId === "fda") {
        return (
            (trial.status === "pending-approval" &&
                approvals.fda === "pending") ||
            (Boolean(trial.batchSubmitted) && !trial.assignmentsLocked) ||
            (allDosed &&
                Boolean(trial.notifiedFDA) &&
                Boolean(trial.assignmentsLocked) &&
                !trial.disclosed)
        );
    }

    if (portalId === "jh-admin") {
        return (
            trial.status === "active" &&
            allDosed &&
            Boolean(trial.assignmentsLocked) &&
            !trial.notifiedFDA
        );
    }

    if (portalId === "jh-doctor") {
        return false;
    }

    if (portalId === "bavaria") {
        return fullyApproved && !trial.batchSubmitted;
    }

    return false;
}

export function needsWorkflowReviewTag(
    trial: Trial,
    portalId: PortalId,
    allDosed: boolean,
): boolean {
    if (trial.archived || trial.status !== "active") return false;

    if (portalId === "jh-admin") {
        return (
            allDosed && Boolean(trial.assignmentsLocked) && !trial.notifiedFDA
        );
    }

    if (portalId === "fda") {
        return (
            allDosed &&
            Boolean(trial.assignmentsLocked) &&
            Boolean(trial.notifiedFDA) &&
            !trial.disclosed
        );
    }

    return false;
}
