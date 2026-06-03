import type { Trial } from "@/types";

export interface BatchCalculation {
  totalVials: number;
  treatment: number;
  placebo: number;
  treatmentPatients: number;
  placeboPatients: number;
}

export function calculateTreatmentPatientCounts(totalPatients: number, treatmentPct = 50) {
  const patients = Math.max(0, Math.floor(Number(totalPatients) || 0));
  const percent = Math.min(100, Math.max(0, Number(treatmentPct) || 50));
  const treatmentPatients = Math.round((patients * percent) / 100);

  return {
    treatmentPatients,
    placeboPatients: patients - treatmentPatients,
  };
}

export function calculateBatch(totalPatients: number, trial: Trial): BatchCalculation {
  const dosesPerPatient = Math.max(0, Math.floor(Number(trial.dosesPerPatient) || 0));
  const { treatmentPatients, placeboPatients } = calculateTreatmentPatientCounts(
    totalPatients,
    trial.treatmentPct ?? 50,
  );
  const treatment = treatmentPatients * dosesPerPatient;
  const placebo = placeboPatients * dosesPerPatient;

  return {
    totalVials: treatment + placebo,
    treatment,
    placebo,
    treatmentPatients,
    placeboPatients,
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
