import type {
  Patient,
  PortalId,
  ReportRow,
  Trial,
  TrialAssignment,
  TrialEnrollment,
} from "@/types";

export interface PatientDisplay {
  id: string;
  name: string;
  dob: string;
  icdCodes: string;
  eligible: boolean;
  eligibilityLabel: string;
  doses: number;
  doseLabel: string;
  statusLabel: string;
  trackingId: string;
  showPii: boolean;
}

export interface ReportRowDisplay {
  patientId: string;
  patientName: string;
  groupLabel: string;
  groupTone: "red" | "blue";
  startValue: string;
  endValue: string;
  reductionLabel: string;
  adverseEventCount: number;
  adverseEvents: string;
}

export function canShowPatientPii(portalId: PortalId): boolean {
  return portalId === "jh-doctor";
}

export function maskPatientName(patientOrId: Patient | string): string {
  const id = typeof patientOrId === "string" ? patientOrId : patientOrId.id;
  return `Patient ${id}`;
}

export function hiddenPiiLabel(): string {
  return "Hidden";
}

export function buildPatientDisplay(
  patient: Patient,
  enrollment: TrialEnrollment | undefined,
  trial: Trial,
  portalId: PortalId,
  assignment?: TrialAssignment,
  showTracking = false,
): PatientDisplay {
  const showPii = canShowPatientPii(portalId);
  const doses = enrollment?.doses ?? 0;
  const eligible = Boolean(enrollment?.eligible);

  return {
    id: patient.id,
    name: showPii ? patient.name : maskPatientName(patient),
    dob: showPii ? patient.dob : hiddenPiiLabel(),
    icdCodes: patient.icdCodes.join(", ") || "None",
    eligible,
    eligibilityLabel: eligible ? "Eligible" : "Excluded",
    doses,
    doseLabel: `${doses}/${trial.dosesPerPatient}`,
    statusLabel: !eligible ? "Excluded" : doses >= trial.dosesPerPatient ? "Complete" : "Active",
    trackingId: showTracking ? assignment?.trackingId ?? "-" : "-",
    showPii,
  };
}

export function buildAnonymizedPatientDisplay(
  patient: Patient,
  enrollment: TrialEnrollment | undefined,
  trial: Trial,
  assignment?: TrialAssignment,
  showTracking = false,
): PatientDisplay {
  return buildPatientDisplay(patient, enrollment, trial, "fda", assignment, showTracking);
}

export function buildReportRowDisplay(
  row: ReportRow,
  patient: Patient | undefined,
  portalId: PortalId,
): ReportRowDisplay {
  const showPii = patient ? canShowPatientPii(portalId) : false;
  const patientName = patient && showPii ? patient.name : maskPatientName(row.patientId);

  return {
    patientId: row.patientId,
    patientName,
    groupLabel: row.group === "treatment" ? "Treatment" : "Placebo",
    groupTone: row.group === "treatment" ? "red" : "blue",
    startValue: row.startValue === null ? "N/A" : String(row.startValue),
    endValue: row.endValue === null ? "N/A" : String(row.endValue),
    reductionLabel: row.reductionLabel,
    adverseEventCount: row.adverseEvents.length,
    adverseEvents: row.adverseEvents.length ? row.adverseEvents.join(", ") : "None",
  };
}

export function buildAnonymizedReportRowDisplay(row: ReportRow): ReportRowDisplay {
  return buildReportRowDisplay(row, undefined, "fda");
}
