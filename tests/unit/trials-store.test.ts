import { expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { useAuthStore, usePatientsStore, useTrialsStore } from "@/stores";
import { createAssignments } from "@/composables/assignments/useAssignments";
import { allEligibleDosed } from "@/composables/patients/usePatients";
import { appointment, patient } from "./fixtures";

function createTrial() {
    useAuthStore().selectPortal("bavaria");
    const store = useTrialsStore();
    const trial = store.createTrial({
        name: "Lifecycle Trial",
        drug: "TEST",
        phase: "Phase 1",
        condition: "Diabetes",
        start: "2026-01-01",
        end: "2026-12-31",
        enrollment: 2,
        dosesPerPatient: 2,
        description: "",
    });
    return {
        store,
        id: trial.id,
        trial: store.trials.find((t) => t.id === trial.id)!,
    };
}

it("completes the approval, enrollment, shipment, assignment, dosing and disclosure lifecycle with an audit trail", () => {
    const { store, id, trial } = createTrial();
    usePatientsStore().upsertPatient(patient());
    expect(store.approveTrial(id, "jh-admin")).toBe(false);
    expect(store.submitBatch(id, { batchRef: "LOT", treatmentPct: 50 })).toBe(
        false,
    );
    expect(store.approveTrial(id, "fda")).toBe(true);
    expect(store.approveTrial(id, "jh-admin")).toBe(false);
    store.enrollPatient(id, "TEST-P1", true);
    expect(store.approveTrial(id, "jh-admin")).toBe(true);
    expect(store.submitBatch(id, { batchRef: "LOT", treatmentPct: 50 })).toBe(
        true,
    );
    expect(store.saveAssignments(id, createAssignments([patient()]))).toBe(
        true,
    );
    expect(trial.status).toBe("active");
    expect(store.notifyFda(id, "jh-admin", false)).toBe(false);
    expect(store.discloseTrial(id, "fda", true)).toBe(false);
    store.logAppointment(id, "TEST-P1", appointment());
    store.logAppointment(
        id,
        "TEST-P1",
        appointment({ date: "2026-06-02", bloodTestLevel: 50 }),
    );
    const allDosed = allEligibleDosed(
        trial,
        [patient()],
        store.enrollmentsFor(id),
    );
    expect(allDosed).toBe(true);
    expect(store.notifyFda(id, "jh-admin", allDosed)).toBe(true);
    expect(store.notifyFda(id, "jh-admin", allDosed)).toBe(false);
    expect(store.discloseTrial(id, "fda", allDosed)).toBe(true);
    expect(store.discloseTrial(id, "fda", allDosed)).toBe(false);
    expect(trial.statusLabel).toBe("Completed");
    expect(store.auditLog.map((e) => [e.actorPortalId, e.action])).toEqual([
        ["fda", "trial.approve"],
        ["jh-admin", "trial.approve"],
        ["bavaria", "trial.submit_batch"],
        ["fda", "trial.lock_assignments"],
        ["jh-admin", "trial.notify_fda"],
        ["fda", "trial.disclose_report"],
    ]);
    expect(new Set(store.auditLog.map((e) => e.id)).size).toBe(6);
});
it.each([NaN, -1, 9, 91, Infinity])(
    "rejects invalid batch percentages %s",
    (pct) => {
        const { store, id, trial } = createTrial();
        trial.approvals = { fda: "approved", jh: "approved" };
        expect(
            store.submitBatch(id, { batchRef: "LOT", treatmentPct: pct }),
        ).toBe(false);
        expect(trial.batchSubmitted).toBe(false);
    },
);
it("rejects unauthorized workflow actions and incomplete assignment maps", () => {
    const { store, id, trial } = createTrial();
    expect(store.approveTrial(id, "bavaria")).toBe(false);
    expect(store.rejectTrial(id, "jh-doctor")).toBe(false);
    trial.approvals = { fda: "approved", jh: "approved" };
    expect(
        store.submitBatch(id, { batchRef: "LOT", treatmentPct: 50 }, "fda"),
    ).toBe(false);
    store.submitBatch(id, { batchRef: "LOT", treatmentPct: 50 });
    expect(store.saveAssignments(id, {})).toBe(false);
    store.enrollPatient(id, "TEST-P1", true);
    expect(store.saveAssignments(id, {})).toBe(false);
    const assignments = createAssignments([patient()]);
    expect(store.saveAssignments(id, assignments, "bavaria")).toBe(false);
    expect(
        store.saveAssignments(id, {
            ...assignments,
            extra: assignments["TEST-P1"],
        }),
    ).toBe(false);
    expect(
        store.saveAssignments(id, {
            "TEST-P1": { ...assignments["TEST-P1"], patientId: "wrong" },
        }),
    ).toBe(false);
    expect(store.logAppointment(id, "TEST-P1", appointment(), "jh-admin")).toBe(
        false,
    );
    expect(store.logAppointment(id, "missing", appointment())).toBe(false);
    expect(store.notifyFda(id, "fda", true)).toBe(false);
    expect(store.discloseTrial(id, "jh-admin", true)).toBe(false);
    expect(store.auditLog).toHaveLength(1);
});
it("makes rejection terminal and only deletes archived rejected trials for Bavaria", async () => {
    const { store, id, trial } = createTrial();
    expect(store.rejectTrial(id, "fda")).toBe(true);
    expect(trial.status).toBe("rejected");
    expect(store.approveTrial(id, "fda")).toBe(false);
    expect(store.enrollPatient(id, "TEST-P1", true)).toBe(false);
    expect(store.logAppointment(id, "TEST-P1", appointment())).toBe(false);
    expect(store.deleteTrial(id)).toBe(false);
    expect(store.toggleArchive(id)).toBe(true);
    useAuthStore().selectPortal("fda");
    await nextTick();
    expect(store.deleteTrial(id)).toBe(false);
    useAuthStore().selectPortal("bavaria");
    await nextTick();
    expect(store.deleteTrial(id)).toMatchObject({ id });
    expect(store.trials.some((t) => t.id === id)).toBe(false);
    expect(store.currentTrialId).not.toBe(id);
    expect(store.deleteTrial(id)).toBe(false);
});
it("generates sequential IDs and clamps pagination and case-insensitive search", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2030, 0, 1, 12));
    const first = createTrial();
    const second = createTrial();
    expect(first.id).toBe("TRL-2030-001");
    expect(second.id).toBe("TRL-2030-002");
    for (let i = 0; i < 12; i++) createTrial();
    const { store } = first;
    expect(store.visibleTrials).toHaveLength(10);
    store.changePage(999);
    expect(store.sidebarPage).toBe(store.pageCount);
    store.setSearch("  LIFECYCLE  ");
    expect(store.sidebarPage).toBe(1);
    expect(store.filteredTrials).toHaveLength(14);
    store.setSearch("no such trial");
    expect(store.visibleTrials).toEqual([]);
    expect(store.pageCount).toBe(1);
    store.changePage(-999);
    expect(store.sidebarPage).toBe(1);
    expect(store.enrollmentsFor("missing")).toEqual({});
    expect(store.assignmentsFor("missing")).toEqual({});
});
it("keeps doctor selections restricted and separates completed trials", async () => {
    const auth = useAuthStore();
    const store = useTrialsStore();
    expect(store.filteredTrials.every((t) => t.status === "active")).toBe(true);
    const selected = store.currentTrialId;
    store.selectTrial("TRL-2026-901");
    expect(store.currentTrialId).toBe(selected);
    store.setArchiveFilter(true);
    expect(
        store.filteredTrials.every(
            (t) => t.status === "complete" && t.disclosed,
        ),
    ).toBe(true);
    auth.selectPortal("bavaria");
    await nextTick();
    store.setArchiveFilter(false);
    expect(store.filteredTrials.some((t) => t.status === "rejected")).toBe(
        true,
    );
});
it("preserves visits when enrollment eligibility changes and removes all references on deletion", () => {
    const { store, id } = createTrial();
    store.importPatients(id, [{ patientId: "TEST-P1", eligible: true }]);
    store.logAppointment(id, "TEST-P1", appointment());
    store.enrollPatient(id, "TEST-P1", false);
    expect(store.enrollmentsFor(id)["TEST-P1"]).toMatchObject({
        eligible: false,
        doses: 1,
    });
    expect(store.logAppointment(id, "TEST-P1", appointment())).toBe(false);
    store.assignments[id] = createAssignments([patient()]);
    store.removePatientReferences("TEST-P1");
    expect(store.enrollmentsFor(id)["TEST-P1"]).toBeUndefined();
    expect(store.assignmentsFor(id)["TEST-P1"]).toBeUndefined();
});
it("uses seeded data without networking in demo mode", async () => {
    const store = useTrialsStore();
    expect(await store.hydrateFromApi()).toBe(false);
    expect(store.apiFallback).toBe(true);
    expect(store.apiHydrating).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
});
