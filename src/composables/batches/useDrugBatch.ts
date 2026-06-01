import type { Trial } from "@/types";

export interface BatchCalculation {
  totalVials: number;
  treatment: number;
  placebo: number;
}

export function calculateBatch(totalPatients: number, trial: Trial): BatchCalculation {
  const dosesPerPatient = Math.max(0, Number(trial.dosesPerPatient) || 0);
  const treatmentPct = Math.min(100, Math.max(0, Number(trial.treatmentPct ?? 50) || 50));
  const totalVials = totalPatients * dosesPerPatient;
  const treatment = Math.round((totalVials * treatmentPct) / 100);

  return {
    totalVials,
    treatment,
    placebo: totalVials - treatment,
  };
}

export function canSubmitBatch(trial: Trial): boolean {
  return trial.status !== "rejected" && trial.approvals.fda === "approved" && trial.approvals.jh === "approved";
}

export function useDrugBatch(totalPatients: number, trial: Trial) {
  return {
    ...calculateBatch(totalPatients, trial),
    canSubmit: canSubmitBatch(trial),
  };
}
