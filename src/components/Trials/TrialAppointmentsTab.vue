<script setup lang="ts">
import { ActionButton, TrialAppointmentsTabLogTable } from "@/components";
import { computed, ref } from "vue";

import { SvgIcon } from "@/assets";
import { useAuthStore, useUiStore } from "@/stores";
import type { Appointment, Patient, Trial, TrialEnrollmentMap } from "@/types";

type AppointmentLogRow = Appointment & {
    patientId: string;
    patientName: string;
};

const props = defineProps<{
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
}>();

const auth = useAuthStore();
const ui = useUiStore();
const query = ref("");

const eligiblePatients = computed(() =>
    props.patients.filter((patient) => props.enrollments[patient.id]?.eligible),
);
const filteredPatients = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return eligiblePatients.value;
    return eligiblePatients.value.filter((patient) =>
        [patient.name, patient.id].some((value) =>
            value.toLowerCase().includes(q),
        ),
    );
});
const rows = computed<AppointmentLogRow[]>(() =>
    filteredPatients.value
        .flatMap((patient) =>
            (props.enrollments[patient.id]?.appointments ?? []).map(
                (appointment) => ({
                    ...appointment,
                    patientId: patient.id,
                    patientName: patient.name,
                }),
            ),
        )
        .sort((a, b) =>
            `${b.date} ${b.time ?? ""}`.localeCompare(
                `${a.date} ${a.time ?? ""}`,
            ),
        ),
);
const canLogAppointment = computed(
    () =>
        auth.selectedPortalId === "jh-doctor" &&
        props.trial.status !== "complete",
);
</script>

<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
                <div class="font-serif text-2xl font-normal">Appointments</div>
                <div class="mt-0.5 text-[13px] text-muted">
                    All visits and dose administrations for {{ trial.name }}.
                </div>
            </div>
            <div
                class="flex w-full flex-wrap items-center justify-center gap-2 md:w-auto md:justify-end"
            >
                <input
                    v-model="query"
                    class="min-h-10 w-full min-w-0 max-w-[340px] rounded-[5px] border-[1.5px] border-rule bg-bg px-4 py-3 text-center text-base text-ink focus:border-fda focus:bg-surface focus:outline-none md:w-[280px] md:text-left"
                    placeholder="Search patients..."
                />
                <ActionButton
                    v-if="canLogAppointment"
                    variant="jh"
                    @click="ui.showModal('appointment-form')"
                >
                    <SvgIcon name="add" />
                    Log Appointment
                </ActionButton>
            </div>
        </div>
        <TrialAppointmentsTabLogTable :rows="rows" />
    </div>
</template>
