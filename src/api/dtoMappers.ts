import type {
    Patient,
    ReportRow,
    Trial,
    TrialAssignmentMap,
    TrialPatientsByTrial,
} from "@/types";

export interface BackendSnapshotDto {
    trials: Trial[];
    patients: Patient[];
    trialPatients: TrialPatientsByTrial;
    assignments: Record<string, TrialAssignmentMap>;
    reports?: Record<string, ReportRow[]>;
}

export function mapSnapshotDto(dto: BackendSnapshotDto): BackendSnapshotDto {
    return {
        trials: dto.trials ?? [],
        patients: dto.patients ?? [],
        trialPatients: dto.trialPatients ?? {},
        assignments: dto.assignments ?? {},
        reports: dto.reports ?? {},
    };
}

export function mapPatientToDto(patient: Patient) {
    return {
        ...patient,
        icdCodes: patient.icdCodes ?? [],
    };
}

export function mapTrialToDto(trial: Trial) {
    return {
        ...trial,
        eligibility: trial.eligibility ?? null,
    };
}
