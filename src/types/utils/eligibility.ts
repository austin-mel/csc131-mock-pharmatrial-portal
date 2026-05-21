import type { Patient } from '@/types/patient';
import type { TrialEligibility } from '@/types/trial';

export function checkEligibility(patient: Patient, eligibility?: TrialEligibility | null): boolean {
  if (!eligibility) {
    return true;
  }

  const hasIncludedIcd = eligibility.includeIcd.length === 0
    || patient.icdCodes.some(code => eligibility.includeIcd.includes(code));
  const hasExcludedIcd = patient.icdCodes.some(code => eligibility.excludeIcd.includes(code));
  const hasIncompatibleMedication = eligibility.incompatMeds.some(medication =>
    patient.meds?.toLowerCase().includes(medication.toLowerCase()),
  );

  return hasIncludedIcd && !hasExcludedIcd && !hasIncompatibleMedication;
}
