export type AssignedDrug = "bavaria" | "placebo";

export interface TrialAssignment {
    patientId: string;
    drug: AssignedDrug;
    trackingId: string;
}

export type TrialAssignmentMap = Record<string, TrialAssignment>;
