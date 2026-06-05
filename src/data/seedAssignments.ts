import type { TrialAssignmentMap } from "@/types";

export const seedAssignments: Record<string, TrialAssignmentMap> = {
    "TRL-2023-004": {
        "a3f9-2c11": {
            patientId: "a3f9-2c11",
            drug: "bavaria",
            trackingId: "BAV-004-A",
        },
        "c1a8-5f90": {
            patientId: "c1a8-5f90",
            drug: "placebo",
            trackingId: "BAV-004-B",
        },
    },
    "TRL-2023-007": {
        "a3f9-2c11": {
            patientId: "a3f9-2c11",
            drug: "bavaria",
            trackingId: "BAV-007-A",
        },
        "b7d2-8e44": {
            patientId: "b7d2-8e44",
            drug: "placebo",
            trackingId: "BAV-007-B",
        },
    },
    "TRL-2022-014": {
        "a3f9-2c11": {
            patientId: "a3f9-2c11",
            drug: "bavaria",
            trackingId: "BAV-014-A",
        },
        "d4e6-1b72": {
            patientId: "d4e6-1b72",
            drug: "placebo",
            trackingId: "BAV-014-B",
        },
    },
};
