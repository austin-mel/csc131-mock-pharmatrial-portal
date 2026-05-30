import type { Patient, Trial, TrialEnrollmentMap } from '@/types';

export function trialPatients(patients: Patient[], enrollments: TrialEnrollmentMap): Patient[] {
  return patients.filter((patient) => enrollments[patient.id]);
}

export function eligiblePatients(patients: Patient[], enrollments: TrialEnrollmentMap): Patient[] {
  return trialPatients(patients, enrollments).filter((patient) => enrollments[patient.id].eligible);
}

export function checkEligibility(patient: Patient, trial: Trial): boolean {
  const criteria = trial.eligibility;
  if (!criteria) {
    const condition = trial.condition.toLowerCase();
    if (condition.includes('hiv')) return patient.icdCodes.some((code) => code === 'B20' || code === 'Z21');
    return patient.icdCodes.length > 0;
  }

  const icd = patient.icdCodes.map((code) => code.toUpperCase());
  if (criteria.includeIcd.length && !criteria.includeIcd.some((code) => icd.some((item) => item.includes(code.toUpperCase())))) {
    return false;
  }
  if (criteria.excludeIcd.some((code) => icd.some((item) => item.includes(code.toUpperCase())))) return false;

  if (criteria.minAge) {
    const dob = new Date(patient.dob);
    if (Number.isFinite(dob.getTime())) {
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < criteria.minAge) return false;
    }
  }

  const meds = (patient.meds ?? '').toLowerCase();
  if (criteria.incompatMeds.some((med) => meds.includes(med.toLowerCase()))) return false;

  return true;
}
