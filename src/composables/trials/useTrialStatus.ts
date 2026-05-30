import type { PortalId, Trial, TrialTab } from "@/types";

type ApprovalStatus = "approved" | "pending" | "rejected" | "blocked";

export const lifecycleSteps = [
  "Bavaria Creates",
  "FDA Approval",
  "JH Approval",
  "Bavaria Ship",
  "FDA Assignment",
  "Complete",
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

export function statusBadges(trial: Trial): StatusBadgeDefinition[] {
  const badges: StatusBadgeDefinition[] = [];

  if (trial.archived) badges.push({ label: "Archived", tone: "gray" });

  if (trial.status === "complete") badges.push({ label: "Completed", tone: "purple" });
  else if (trial.status === "rejected") badges.push({ label: "Rejected", tone: "red" });
  else if (trial.status === "active" && trial.batchSubmitted && !trial.assignmentsLocked) {
    badges.push({ label: "Approved - Awaiting Assignments", tone: "orange" });
  } else if (trial.approvals?.jh === "approved" && trial.approvals.fda === "approved" && !trial.batchSubmitted) {
    badges.push({ label: "Approved - Awaiting Batch", tone: "orange" });
  } else if (trial.status === "active") badges.push({ label: "Active", tone: "green" });
  else badges.push({ label: "Pending Approval", tone: "yellow" });

  return badges;
}

function approvalsFor(trial: Trial): { jh: ApprovalStatus; fda: ApprovalStatus } {
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

export function currentLifecycleStepIndex(trial: Trial, allDosed = false): number {
  const approvals = approvalsFor(trial);

  if (trial.disclosed && trial.notifiedFDA) return 7;
  if (trial.notifiedFDA) return 6;
  if (trial.status === "complete" || allDosed) return 5;
  if (trial.assignmentsLocked) return 4;
  if (trial.batchSubmitted) return 3;
  if (approvals.jh === "approved" && approvals.fda === "approved") return 2;
  if (approvals.fda === "approved") return 1;
  return 0;
}

export function approvalLabel(value: ApprovalStatus): string {
  return value === "blocked" ? "Awaiting FDA" : value.charAt(0).toUpperCase() + value.slice(1);
}

export function approvalTone(value: ApprovalStatus): StatusBadgeDefinition["tone"] {
  if (value === "approved") return "green";
  if (value === "rejected") return "red";
  return "yellow";
}

export function trialApprovals(trial: Trial): { jh: ApprovalStatus; fda: ApprovalStatus } {
  return approvalsFor(trial);
}

export function isTrialCurrent(trial: Trial): boolean {
  return trial.status === "complete" || (trial.status === "active" && Boolean(trial.assignmentsLocked));
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

  if ((portalId === "jh-admin" || portalId === "jh-doctor") && finalReportPublished) {
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
