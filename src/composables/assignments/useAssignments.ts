import type { Patient, TrialAssignmentMap } from "@/types";
import { calculateTreatmentPatientCounts } from "@/composables";

function trackingPrefix(index: number, isTreatment: boolean) {
    return `${isTreatment ? "BAV" : "PLC"}-${String(index + 1).padStart(3, "0")}`;
}

export function createAssignments(
    patients: Patient[],
    treatmentPct = 50,
): TrialAssignmentMap {
    const { treatmentPatients } = calculateTreatmentPatientCounts(
        patients.length,
        treatmentPct,
    );
    const shuffled = [...patients].sort(() => Math.random() - 0.5);

    return shuffled.reduce<TrialAssignmentMap>((map, patient, index) => {
        const isTreatment = index < treatmentPatients;
        map[patient.id] = {
            patientId: patient.id,
            drug: isTreatment ? "bavaria" : "placebo",
            trackingId: trackingPrefix(index, isTreatment),
        };
        return map;
    }, {});
}

export function assignmentCounts(assignments: TrialAssignmentMap) {
    const rows = Object.values(assignments);
    return {
        treatment: rows.filter((assignment) => assignment.drug === "bavaria")
            .length,
        placebo: rows.filter((assignment) => assignment.drug === "placebo")
            .length,
    };
}
