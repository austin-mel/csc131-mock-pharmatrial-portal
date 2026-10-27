import { expect, it } from "vitest";
import {
    calculateBatch,
    calculateTreatmentPatientCounts,
    canSubmitBatch,
    useDrugBatch,
} from "@/composables/batches/useDrugBatch";
import {
    assignmentCounts,
    createAssignments,
} from "@/composables/assignments/useAssignments";
import { patient, trial } from "./fixtures";

it.each([
    [10, 50, 5, 5],
    [3, 50, 2, 1],
    [-2, 50, 0, 0],
    [3.9, 200, 3, 0],
])(
    "splits %s patients at %s percent",
    (count, pct, treatmentPatients, placeboPatients) => {
        expect(calculateTreatmentPatientCounts(count, pct)).toEqual({
            treatmentPatients,
            placeboPatients,
        });
    },
);
it("computes vial counts and requires both approvals for shipment", () => {
    expect(calculateBatch(3, trial())).toEqual({
        totalVials: 6,
        treatment: 4,
        placebo: 2,
        treatmentPatients: 2,
        placeboPatients: 1,
    });
    expect(canSubmitBatch(trial())).toBe(false);
    const approved = trial({ approvals: { fda: "approved", jh: "approved" } });
    expect(useDrugBatch(3, approved).canSubmit).toBe(true);
    expect(canSubmitBatch({ ...approved, status: "rejected" })).toBe(false);
    expect(calculateBatch(3, trial({ dosesPerPatient: -1 })).totalVials).toBe(
        0,
    );
});
it("assigns every patient exactly once with the requested allocation and unique tracking IDs", () => {
    const people = Array.from({ length: 10 }, (_, index) =>
        patient({ id: `P${index}` }),
    );
    const originalOrder = people.map((p) => p.id);
    const assignments = createAssignments(people, 70);
    expect(Object.keys(assignments).sort()).toEqual([...originalOrder].sort());
    expect(assignmentCounts(assignments)).toEqual({ treatment: 7, placebo: 3 });
    expect(
        new Set(Object.values(assignments).map((a) => a.trackingId)).size,
    ).toBe(10);
    for (const [id, assignment] of Object.entries(assignments)) {
        expect(assignment.patientId).toBe(id);
        expect(assignment.trackingId).toMatch(
            assignment.drug === "bavaria" ? /^BAV-/ : /^PLC-/,
        );
    }
    expect(people.map((p) => p.id)).toEqual(originalOrder);
    expect(createAssignments([])).toEqual({});
});
