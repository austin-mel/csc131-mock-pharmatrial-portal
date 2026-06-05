<script setup lang="ts">
import {
    ActionButton,
    DetailGrid,
    ModalShell,
    PatientAppointmentSummary,
    PatientDetailHeader,
} from "@/components";
import { computed, ref, watch } from "vue";

import { useAuthStore } from "@/stores";
import { buildPatientDisplay, canShowPatientPii } from "@/utils";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
    open: boolean;
    patient: Patient | null;
    trial: Trial;
    enrollments: TrialEnrollmentMap;
}>();
defineEmits<{
    close: [];
    edit: [id: string];
    logAppointment: [id: string];
    remove: [id: string];
}>();

const auth = useAuthStore();
const appointmentPage = ref(1);
const showPii = computed(() => canShowPatientPii(auth.selectedPortalId));
const showEligibilityReview = computed(
    () => auth.selectedPortalId !== "jh-doctor",
);
const enrollment = computed(() =>
    props.patient ? props.enrollments[props.patient.id] : null,
);
const display = computed(() =>
    props.patient
        ? buildPatientDisplay(
              props.patient,
              enrollment.value ?? undefined,
              props.trial,
              auth.selectedPortalId,
          )
        : null,
);
const canEdit = computed(
    () => showPii.value && props.trial.status !== "complete",
);
const canDelete = computed(
    () =>
        auth.selectedPortalId === "jh-admin" &&
        props.trial.status !== "complete",
);
const canLogAppointment = computed(
    () =>
        auth.selectedPortalId === "jh-doctor" &&
        props.trial.status !== "complete" &&
        Boolean(enrollment.value?.eligible),
);
const bannerClass = computed(() =>
    enrollment.value?.eligible ? "bg-jh" : "bg-bav",
);
const appointments = computed(() =>
    [...(enrollment.value?.appointments ?? [])].sort((a, b) =>
        `${b.date} ${b.time ?? ""}`.localeCompare(`${a.date} ${a.time ?? ""}`),
    ),
);
const currentAppointment = computed(
    () => appointments.value[appointmentPage.value - 1] ?? null,
);
const initials = computed(
    () =>
        (display.value?.name ?? "")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "",
);

const items = computed(() => {
    if (!props.patient) return [];
    const base = [
        { label: "UUID", value: display.value?.id ?? props.patient.id },
        { label: "ICD-10 Codes", value: display.value?.icdCodes ?? "None" },
        {
            label: "Enrollment",
            value: enrollment.value ? "Enrolled" : "Not enrolled",
        },
        {
            label: "Doses",
            value:
                display.value?.doseLabel ?? `0/${props.trial.dosesPerPatient}`,
        },
        {
            label: "Appointments",
            value: enrollment.value?.appointments.length ?? 0,
        },
    ];
    if (showEligibilityReview.value) {
        base.splice(3, 0, {
            label: "Eligibility",
            value: display.value?.eligibilityLabel ?? "Excluded",
        });
    }

    if (!showPii.value) return base;

    return [
        { label: "Name", value: display.value?.name ?? props.patient.name },
        { label: "DOB", value: display.value?.dob ?? props.patient.dob },
        { label: "Blood Type", value: props.patient.bloodType },
        ...base,
        { label: "Blood Pressure", value: props.patient.bp ?? "-" },
        { label: "O2 Saturation", value: props.patient.oxygen ?? "-" },
        { label: "Temperature", value: props.patient.temperature ?? "-" },
        {
            label: "Height / Weight",
            value: `${props.patient.height ?? "-"} cm / ${props.patient.weight ?? "-"} kg`,
        },
        { label: "Medications", value: props.patient.meds ?? "None" },
        { label: "Allergies", value: props.patient.allergy ?? "None" },
        { label: "Address", value: props.patient.address ?? "-" },
        { label: "Insurance", value: props.patient.insuranceId ?? "-" },
        { label: "Employment", value: props.patient.employment ?? "-" },
    ];
});

const appointmentItems = computed(() => {
    const appointment = currentAppointment.value;
    if (!appointment) return [];

    return [
        { label: "Date", value: appointment.date },
        { label: "Time", value: appointment.time ?? "-" },
        { label: "Visit Type", value: appointment.type },
        { label: "Dose", value: appointment.dose ? "Recorded" : "No" },
        {
            label: "Blood Test",
            value: appointment.bloodTestLevel ?? "Not recorded",
        },
        {
            label: "Adverse Events",
            value: appointment.adverseEvents.length
                ? appointment.adverseEvents.join(", ")
                : "None",
        },
        { label: "Notes", value: appointment.note || "-" },
    ];
});

watch(
    () => props.patient?.id,
    () => {
        appointmentPage.value = 1;
    },
);

watch(appointments, (items) => {
    appointmentPage.value = Math.min(
        Math.max(items.length, 1),
        appointmentPage.value,
    );
});

function changeAppointmentPage(delta: number) {
    appointmentPage.value = Math.min(
        appointments.value.length,
        Math.max(1, appointmentPage.value + delta),
    );
}
</script>

<template>
    <ModalShell
        :open="open"
        title="Patient Detail"
        wide
        @close="$emit('close')"
    >
        <div
            v-if="patient"
            :patient-id="patient.id"
            :name="display?.name ?? patient.id"
            :initials="initials"
            :eligible="Boolean(enrollment?.eligible)"
            :enrolled="Boolean(enrollment)"
            :doses="enrollment?.doses ?? 0"
            :total-doses="trial.dosesPerPatient"
            :banner-class="bannerClass"
            :show-eligibility-review="showEligibilityReview"
        />
        <DetailGrid v-if="patient" :items="items" />
        <PatientAppointmentSummary
            v-if="patient"
            :appointment="currentAppointment"
            :appointment-items="appointmentItems"
            :page="appointmentPage"
            :count="appointments.length"
            @change="changeAppointmentPage"
        />
        <template #footer>
            <div
                class="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <ActionButton
                        v-if="patient && canDelete"
                        variant="danger"
                        @click="$emit('remove', patient.id)"
                    >
                        Delete Record
                    </ActionButton>
                </div>
                <div class="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
                    <ActionButton @click="$emit('close')">Close</ActionButton>
                    <ActionButton
                        v-if="patient && canLogAppointment"
                        variant="jh"
                        @click="$emit('logAppointment', patient.id)"
                    >
                        Log Appointment
                    </ActionButton>
                    <ActionButton
                        v-if="patient && canEdit"
                        variant="jh"
                        @click="$emit('edit', patient.id)"
                    >
                        Edit Record
                    </ActionButton>
                </div>
            </div>
        </template>
    </ModalShell>
</template>
