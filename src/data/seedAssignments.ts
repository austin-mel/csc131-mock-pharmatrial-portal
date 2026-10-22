import type { TrialAssignmentMap } from "@/types";

// Only the completed Juniper and active Aspen cohorts have locked assignments.
export const seedAssignments: Record<string, TrialAssignmentMap> = {
    "TRL-2026-903": {
        "UI-PAT-003": {
            patientId: "UI-PAT-003",
            drug: "bavaria",
            trackingId: "UI-JUNIPER-001",
        },
        "UI-PAT-004": {
            patientId: "UI-PAT-004",
            drug: "bavaria",
            trackingId: "UI-JUNIPER-002",
        },
        "UI-PAT-005": {
            patientId: "UI-PAT-005",
            drug: "placebo",
            trackingId: "UI-JUNIPER-003",
        },
        "UI-PAT-006": {
            patientId: "UI-PAT-006",
            drug: "placebo",
            trackingId: "UI-JUNIPER-004",
        },
    },
    "TRL-2026-904": {
        "UI-PAT-007": {
            patientId: "UI-PAT-007",
            drug: "bavaria",
            trackingId: "UI-ASPEN-001",
        },
        "UI-PAT-008": {
            patientId: "UI-PAT-008",
            drug: "bavaria",
            trackingId: "UI-ASPEN-002",
        },
        "UI-PAT-009": {
            patientId: "UI-PAT-009",
            drug: "placebo",
            trackingId: "UI-ASPEN-003",
        },
        "UI-PAT-010": {
            patientId: "UI-PAT-010",
            drug: "placebo",
            trackingId: "UI-ASPEN-004",
        },
    },
};
