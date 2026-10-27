import type {
    AppointmentDraft,
    Patient,
    Trial,
    TrialEnrollment,
} from "@/types";

export const patient = (overrides: Partial<Patient> = {}): Patient => ({
    id: "TEST-P1",
    name: "Alex Example",
    dob: "1990-01-01",
    icdCodes: ["E11"],
    bloodType: "O+",
    meds: "None",
    ...overrides,
});
export const trial = (overrides: Partial<Trial> = {}): Trial => ({
    id: "TEST-T1",
    name: "Test Trial",
    drug: "TEST-DRUG",
    phase: "Phase 2",
    condition: "Diabetes",
    start: "2026-01-01",
    end: "2026-12-31",
    enrollment: 10,
    status: "pending-approval",
    archived: false,
    approvals: { fda: "pending", jh: "blocked" },
    batchSubmitted: false,
    assignmentsLocked: false,
    notifiedFDA: false,
    disclosed: false,
    dosesPerPatient: 2,
    treatmentPct: 50,
    ...overrides,
});
export const enrollment = (
    overrides: Partial<TrialEnrollment> = {},
): TrialEnrollment => ({
    eligible: true,
    doses: 0,
    appointments: [],
    ...overrides,
});
export const appointment = (
    overrides: Partial<AppointmentDraft> = {},
): AppointmentDraft => ({
    date: "2026-06-01",
    time: "09:00",
    type: "Dose Administration",
    bloodTestLevel: 100,
    adverseEvents: [],
    note: "",
    ...overrides,
});
