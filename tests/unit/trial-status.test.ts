import { expect, it } from "vitest";
import * as status from "@/composables/trials/useTrialStatus";
import type { PortalId } from "@/types";
import { trial } from "./fixtures";

it("follows the lifecycle and labels each approval/shipping stage", () => {
    const value = trial();
    expect(status.trialStatusLabel(value)).toBe("Pending FDA Approval");
    expect(status.currentLifecycleStepIndex(value)).toBe(0);
    value.approvals = { fda: "approved", jh: "pending" };
    expect(status.trialStatusLabel(value)).toBe("Pending JH Approval");
    expect(status.currentLifecycleStepIndex(value)).toBe(1);
    value.approvals.jh = "approved";
    expect(status.trialStatusLabel(value)).toBe("Approved - Awaiting Batch");
    expect(status.currentLifecycleStepIndex(value)).toBe(2);
    value.batchSubmitted = true;
    expect(status.trialStatusLabel(value)).toBe(
        "Approved - Awaiting Assignments",
    );
    expect(status.currentLifecycleStepIndex(value)).toBe(3);
    value.assignmentsLocked = true;
    value.status = "active";
    expect(status.trialStatusLabel(value)).toBe("Active");
    expect(status.currentLifecycleStepIndex(value)).toBe(4);
    expect(status.currentLifecycleStepIndex(value, true)).toBe(5);
    value.notifiedFDA = true;
    expect(status.trialStatusLabel(value)).toBe("Awaiting FDA Report");
    expect(status.currentLifecycleStepIndex(value)).toBe(6);
    value.disclosed = true;
    value.status = "complete";
    value.archived = true;
    expect(status.currentLifecycleStepIndex(value)).toBe(7);
    expect(status.statusBadges(value)).toEqual([
        { label: "Archived", tone: "gray" },
        { label: "Completed", tone: "purple" },
    ]);
});
it.each<PortalId>(["jh-doctor", "jh-admin", "fda", "bavaria"])(
    "enforces approval and archive permissions for %s",
    (role) => {
        expect(status.canApproveTrial(trial(), role)).toBe(role === "fda");
        const pendingJh = trial({
            approvals: { fda: "approved", jh: "pending" },
        });
        expect(status.canApproveTrial(pendingJh, role)).toBe(
            role === "jh-admin",
        );
        expect(status.canApproveTrial(pendingJh, role, false)).toBe(false);
        expect(status.canSeePii(role)).toBe(role.startsWith("jh-"));
        expect(
            status.canArchiveTrial(trial({ status: "complete" }), role),
        ).toBe(role === "bavaria");
        expect(
            status.canDeleteArchivedTrial(
                trial({ status: "rejected", archived: true }),
                role,
            ),
        ).toBe(role === "bavaria");
        expect(
            status.canDeleteArchivedTrial(
                trial({ status: "complete", archived: true }),
                role,
            ),
        ).toBe(false);
        expect(status.canAddPatients(trial({ notifiedFDA: true }), role)).toBe(
            false,
        );
    },
);
it.each([
    ["jh-doctor", ["overview", "patients", "appointments", "doses"]],
    ["jh-admin", ["overview", "patients", "doses", "notify"]],
    ["fda", ["overview", "patients", "assignments", "disclose"]],
    ["bavaria", ["overview", "patients", "batch"]],
] as const)("shows only authorized active tabs for %s", (role, tabs) => {
    const active = trial({ status: "active", assignmentsLocked: true });
    expect(status.getVisibleTabs(active, role)).toEqual(tabs);
    expect(
        status.getVisibleTabs(
            { ...active, disclosed: true, notifiedFDA: true },
            role,
        ),
    ).toContain("report");
    expect(status.getVisibleTabs(trial({ status: "rejected" }), role)).toEqual(
        role === "jh-admin" ? ["overview", "patients"] : ["overview"],
    );
});
it("identifies actionable reviews and rejected steps", () => {
    expect(status.needsReview(trial(), "fda", false)).toBe(true);
    expect(status.needsReview(trial({ archived: true }), "fda", false)).toBe(
        false,
    );
    const active = trial({ status: "active", assignmentsLocked: true });
    expect(status.needsWorkflowReviewTag(active, "jh-admin", true)).toBe(true);
    expect(status.needsWorkflowReviewTag(active, "fda", true)).toBe(false);
    expect(
        status.needsWorkflowReviewTag(
            { ...active, notifiedFDA: true },
            "fda",
            true,
        ),
    ).toBe(true);
    expect(status.needsReview(active, "jh-doctor", true)).toBe(false);
    expect(status.rejectedStepIndex(trial())).toBeNull();
    expect(
        status.rejectedStepIndex(
            trial({
                status: "rejected",
                approvals: { fda: "rejected", jh: "blocked" },
            }),
        ),
    ).toBe(1);
    expect(
        status.rejectedStepIndex(
            trial({
                status: "rejected",
                approvals: { fda: "approved", jh: "rejected" },
            }),
        ),
    ).toBe(2);
    expect(status.approvalLabel("blocked")).toBe("Awaiting FDA");
    expect(status.approvalLabel("approved")).toBe("Approved");
    expect(status.approvalTone("approved")).toBe("green");
    expect(status.approvalTone("rejected")).toBe("red");
    expect(status.approvalTone("pending")).toBe("yellow");
});
