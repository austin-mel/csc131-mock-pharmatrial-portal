import type { Trial } from "@/types";

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
