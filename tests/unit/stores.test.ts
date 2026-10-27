import { expect, it } from "vitest";
import { createPinia } from "pinia";
import { usePatientsStore, useUiStore } from "@/stores";
import { patient } from "./fixtures";

it("upserts, looks up and deletes patients without mutating seeds or another session", () => {
    const store = usePatientsStore();
    const count = store.patients.length;
    expect(store.getPatient("missing")).toBeNull();
    store.upsertPatient(patient());
    store.upsertPatient(patient({ name: "Updated Name" }));
    expect(store.patients).toHaveLength(count + 1);
    expect(store.getPatient("TEST-P1")?.name).toBe("Updated Name");
    expect(usePatientsStore(createPinia()).getPatient("TEST-P1")).toBeNull();
    expect(store.deletePatient("TEST-P1")).toBe(true);
    expect(store.deletePatient("TEST-P1")).toBe(false);
    expect(store.patients).toHaveLength(count);
});
it("manages tabs, patient modal context and independently dismissible toasts", () => {
    const ui = useUiStore();
    ui.switchTab("patients");
    expect(ui.activeTab).toBe("patients");
    ui.showModal("patient-detail", "P1");
    expect(ui.openModal).toBe("patient-detail");
    expect(ui.selectedPatientId).toBe("P1");
    ui.closeModal();
    expect(ui.openModal).toBeNull();
    ui.showModal("patient-form");
    expect(ui.selectedPatientId).toBeNull();
    ui.pushToast("Saved", "success");
    ui.pushToast("Info");
    const [first, second] = ui.toasts;
    expect(first.id).not.toBe(second.id);
    expect(second.type).toBe("info");
    ui.dismissToast(first.id);
    expect(ui.toasts).toEqual([second]);
    ui.dismissToast(-1);
    expect(ui.toasts).toHaveLength(1);
});
