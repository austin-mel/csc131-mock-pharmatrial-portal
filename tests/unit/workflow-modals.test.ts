import { expect, it } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import ApprovalModal from "@/components/Modals/Regulatory/ApprovalModal.vue";
import DrugBatchModal from "@/components/Modals/Batches/DrugBatchModal.vue";
import FdaAssignmentModal from "@/components/Modals/Regulatory/FdaAssignmentModal.vue";
import NotifyFdaModal from "@/components/Modals/Regulatory/NotifyFdaModal.vue";
import DiscloseTrialModal from "@/components/Modals/Regulatory/DiscloseTrialModal.vue";
import PatientFormModal from "@/components/Modals/Patients/PatientFormModal.vue";
import PatientDetailModal from "@/components/Modals/Patients/PatientDetailModal.vue";
import AppointmentFormModal from "@/components/Modals/Appointments/AppointmentFormModal.vue";
import {
    useAuthStore,
    usePatientsStore,
    useTrialsStore,
    useUiStore,
} from "@/stores";
import type { PortalId, Trial } from "@/types";
import { appointment, enrollment, patient, trial } from "./fixtures";
import { buildAppointment } from "@/composables/appointments/useAppointments";

function button(wrapper: VueWrapper, text: string) {
    const found = wrapper.findAll("button").find((b) => b.text() === text);
    if (!found) throw new Error(`Missing button: ${text}`);
    return found;
}
function field(wrapper: VueWrapper, text: string) {
    const label = wrapper
        .findAll("label")
        .find((l) => l.get("span").text() === text);
    if (!label) throw new Error(`Missing field: ${text}`);
    return label.get("input, select, textarea");
}
function prepare(role: PortalId, overrides: Partial<Trial> = {}) {
    useAuthStore().selectPortal(role);
    const store = useTrialsStore();
    store.trials.push(trial(overrides));
    usePatientsStore().upsertPatient(patient());
    return { store, value: store.trials.find((t) => t.id === "TEST-T1")! };
}
it("FDA approval saves criteria and recomputes existing patient eligibility", async () => {
    const { store, value } = prepare("fda");
    store.enrollPatient(value.id, "TEST-P1", true);
    const wrapper = mount(ApprovalModal, {
        props: { open: false, trial: value },
    });
    await wrapper.setProps({ open: true });
    await field(wrapper, "Required ICD-10 Codes").setValue(" J45, I10 ");
    await button(wrapper, "Approve Trial").trigger("click");
    expect(value.eligibility?.includeIcd).toEqual(["J45", "I10"]);
    expect(value.approvals).toEqual({ fda: "approved", jh: "pending" });
    expect(store.enrollmentsFor(value.id)["TEST-P1"].eligible).toBe(false);
    expect(wrapper.emitted("close")).toHaveLength(1);
});
it("blocks JH approval without enrollment and permits rejection", async () => {
    const { value } = prepare("jh-admin", {
        approvals: { fda: "approved", jh: "pending" },
    });
    const wrapper = mount(ApprovalModal, {
        props: { open: true, trial: value },
    });
    expect(
        button(wrapper, "Approve Trial").attributes("disabled"),
    ).toBeDefined();
    expect(wrapper.text()).toContain("Assign at least 1 patient");
    await button(wrapper, "Reject Trial").trigger("click");
    expect(value.status).toBe("rejected");
    expect(wrapper.emitted("close")).toHaveLength(1);
});
it("calculates batch quantities, validates percent and persists shipping details", async () => {
    const { value } = prepare("bavaria", {
        approvals: { fda: "approved", jh: "approved" },
    });
    const wrapper = mount(DrugBatchModal, {
        props: { open: false, trial: value, eligibleCount: 4 },
    });
    await wrapper.setProps({ open: true });
    await field(wrapper, "Batch Reference Code").setValue("TEST-LOT");
    await field(wrapper, "Shipping Notes").setValue("Keep chilled");
    await wrapper.get('input[type="range"]').setValue("75");
    expect(wrapper.text()).toContain("Total Vials8");
    await button(wrapper, "Submit Batch").trigger("click");
    expect(value).toMatchObject({
        batchSubmitted: true,
        treatmentPct: 75,
        batchRef: "TEST-LOT",
        shippingNotes: "Keep chilled",
    });
    expect(wrapper.emitted("close")).toHaveLength(1);
});
it("requires randomization before FDA can lock assignments", async () => {
    const { store, value } = prepare("fda", { batchSubmitted: true });
    store.enrollPatient(value.id, "TEST-P1", true);
    const wrapper = mount(FdaAssignmentModal, {
        props: {
            open: false,
            trial: value,
            patients: [patient()],
            enrollments: store.enrollmentsFor(value.id),
            assignments: {},
        },
    });
    await wrapper.setProps({ open: true });
    expect(
        button(wrapper, "Lock Assignments").attributes("disabled"),
    ).toBeDefined();
    await button(wrapper, "Randomize").trigger("click");
    expect(
        button(wrapper, "Lock Assignments").attributes("disabled"),
    ).toBeUndefined();
    await button(wrapper, "Lock Assignments").trigger("click");
    expect(value.assignmentsLocked).toBe(true);
    expect(value.status).toBe("active");
    expect(store.assignmentsFor(value.id)["TEST-P1"].patientId).toBe("TEST-P1");
});
it("keeps notifications and disclosures disabled until all prerequisites are met", async () => {
    const { value } = prepare("jh-admin", {
        status: "active",
        assignmentsLocked: true,
    });
    const notice = mount(NotifyFdaModal, {
        props: { open: true, trial: value, allDosed: false },
    });
    expect(button(notice, "Notify FDA").attributes("disabled")).toBeDefined();
    await notice.setProps({ allDosed: true });
    await button(notice, "Notify FDA").trigger("click");
    expect(value.notifiedFDA).toBe(true);
    const disclosure = mount(DiscloseTrialModal, {
        props: { open: true, trial: value, allDosed: true },
    });
    expect(button(disclosure, "Disclose").attributes("disabled")).toBeDefined();
    useAuthStore().selectPortal("fda");
    await disclosure.vm.$nextTick();
    await button(disclosure, "Disclose").trigger("click");
    expect(value.status).toBe("complete");
    expect(value.disclosed).toBe(true);
    expect(disclosure.emitted("close")).toHaveLength(1);
});
it("validates patient names, saves clinical fields and edits without creating duplicates", async () => {
    const { store, value } = prepare("jh-admin");
    const wrapper = mount(PatientFormModal, {
        props: { open: false, trial: value, patient: null },
    });
    await wrapper.setProps({ open: true });
    await button(wrapper, "Save Patient").trigger("click");
    expect(useUiStore().toasts.at(-1)?.message).toContain(
        "first and last name are required",
    );
    await field(wrapper, "First Name").setValue(" New ");
    await field(wrapper, "Last Name").setValue(" Person ");
    await field(wrapper, "Date of Birth").setValue("1990-01-01");
    await field(wrapper, "ICD-10 Codes").setValue(" E11, I10 ");
    await field(wrapper, "Height (cm)").setValue("175");
    await button(wrapper, "Save Patient").trigger("click");
    const saved = usePatientsStore().patients.find(
        (p) => p.name === "New Person",
    )!;
    expect(saved).toMatchObject({ height: 175, icdCodes: ["E11", "I10"] });
    expect(store.enrollmentsFor(value.id)[saved.id].eligible).toBe(true);
    const count = usePatientsStore().patients.length;
    await wrapper.setProps({ open: false, patient: saved });
    await wrapper.setProps({ open: true });
    await field(wrapper, "Last Name").setValue("Updated");
    await button(wrapper, "Save Patient").trigger("click");
    expect(usePatientsStore().patients).toHaveLength(count);
    expect(usePatientsStore().getPatient(saved.id)?.name).toBe("New Updated");
});
it("logs a selected patient's visit, validates date and preserves null readings", async () => {
    const { store, value } = prepare("jh-doctor", {
        status: "active",
        assignmentsLocked: true,
    });
    store.enrollPatient(value.id, "TEST-P1", true);
    const wrapper = mount(AppointmentFormModal, {
        props: {
            open: false,
            trial: value,
            patients: [patient()],
            enrollments: store.enrollmentsFor(value.id),
        },
    });
    await wrapper.setProps({ open: true });
    await field(wrapper, "Date").setValue("");
    await button(wrapper, "Save Appointment").trigger("click");
    expect(useUiStore().toasts.at(-1)?.message).toContain(
        "appointment date are required",
    );
    await field(wrapper, "Date").setValue("2026-06-01");
    await button(wrapper, "Add Adverse Event").trigger("click");
    await wrapper
        .findAll('input[placeholder="e.g. Mild fatigue"]')[1]
        .setValue(" fatigue ");
    await button(wrapper, "Save Appointment").trigger("click");
    expect(store.enrollmentsFor(value.id)["TEST-P1"]).toMatchObject({
        doses: 1,
        appointments: [
            expect.objectContaining({
                bloodTestLevel: null,
                adverseEvents: ["fatigue"],
            }),
        ],
    });
});
it.each<PortalId>(["jh-doctor", "jh-admin", "fda", "bavaria"])(
    "limits patient detail and actions for %s",
    async (role) => {
        prepare(role);
        const wrapper = mount(PatientDetailModal, {
            props: {
                open: true,
                patient: patient({
                    address: "Private Street",
                    insuranceId: "PRIVATE-INS",
                }),
                trial: trial({ status: "active" }),
                enrollments: {
                    "TEST-P1": enrollment({
                        appointments: [
                            buildAppointment(appointment({ note: "Earlier" })),
                            buildAppointment(
                                appointment({
                                    date: "2026-06-02",
                                    note: "Latest",
                                }),
                            ),
                        ],
                    }),
                },
            },
        });
        expect(wrapper.text()).toContain("Latest");
        if (role.startsWith("jh-")) {
            expect(wrapper.text()).toContain("Alex Example");
            expect(wrapper.text()).toContain("Private Street");
        } else {
            expect(wrapper.text()).not.toContain("Alex Example");
            expect(wrapper.text()).not.toContain("Private Street");
            expect(wrapper.text()).not.toContain("PRIVATE-INS");
        }
        const labels = wrapper.findAll("button").map((b) => b.text());
        expect(labels.includes("Edit Record")).toBe(role.startsWith("jh-"));
        expect(labels.includes("Delete Record")).toBe(role === "jh-admin");
        expect(labels.includes("Log Appointment")).toBe(role === "jh-doctor");
        await button(wrapper, "Next").trigger("click");
        expect(wrapper.text()).toContain("Earlier");
    },
);
