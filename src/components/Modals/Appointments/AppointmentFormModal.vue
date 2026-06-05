<script setup lang="ts">
import {
    ActionButton,
    FormField,
    FormInput,
    FormRow,
    FormSelect,
    FormTextarea,
    ModalShell,
} from "@/components";
import { computed, ref, watch } from "vue";

import { appointmentTypes } from "@/composables";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type {
    AppointmentType,
    Patient,
    Trial,
    TrialEnrollmentMap,
} from "@/types";

const props = defineProps<{
    open: boolean;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    trial: Trial;
    initialPatientId?: string | null;
}>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuthStore();
const trials = useTrialsStore();
const ui = useUiStore();

const patientId = ref("");
const date = ref("");
const time = ref("09:00");
const type = ref<AppointmentType>("Dose Administration");
const bloodTestLevel = ref<string | number | null>(null);
const adverseEvents = ref<string[]>([""]);
const note = ref("");

const patientOptions = computed(() =>
    props.patients.filter((patient) => props.enrollments[patient.id]?.eligible),
);
const initialPatient = computed(
    () =>
        patientOptions.value.find(
            (patient) => patient.id === props.initialPatientId,
        ) ?? patientOptions.value[0],
);

watch(
    () => props.open,
    (open) => {
        if (!open) return;
        patientId.value = initialPatient.value?.id ?? "";
        date.value = new Date().toISOString().slice(0, 10);
        time.value = "09:00";
        type.value = "Dose Administration";
        bloodTestLevel.value = null;
        adverseEvents.value = [""];
        note.value = "";
    },
);

function addAdverseEvent() {
    adverseEvents.value.push("");
}

function removeAdverseEvent(index: number) {
    adverseEvents.value.splice(index, 1);
    if (!adverseEvents.value.length) adverseEvents.value.push("");
}

function save() {
    if (auth.selectedPortalId !== "jh-doctor") {
        ui.pushToast(
            "Only Jane Hopkins doctors can log appointments.",
            "error",
        );
        return;
    }

    if (!patientId.value || !date.value) {
        ui.pushToast("Patient and appointment date are required.", "error");
        return;
    }

    const parsedBloodLevel = Number(bloodTestLevel.value);
    const saved = trials.logAppointment(
        props.trial.id,
        patientId.value,
        {
            date: date.value,
            time: time.value,
            type: type.value,
            bloodTestLevel:
                bloodTestLevel.value === null ||
                bloodTestLevel.value === "" ||
                !Number.isFinite(parsedBloodLevel)
                    ? null
                    : parsedBloodLevel,
            adverseEvents: adverseEvents.value,
            note: note.value,
        },
        auth.selectedPortalId,
    );

    if (!saved) {
        ui.pushToast(
            "Appointment could not be saved for this patient.",
            "error",
        );
        return;
    }

    ui.pushToast("Appointment logged.", "success");
    emit("close");
}
</script>

<template>
    <ModalShell :open="open" title="Log Appointment" @close="$emit('close')">
        <FormField label="Patient">
            <FormSelect v-model="patientId">
                <option value="" disabled>Select eligible patient</option>
                <option
                    v-for="patient in patientOptions"
                    :key="patient.id"
                    :value="patient.id"
                >
                    {{ patient.name }} ({{ patient.id }})
                </option>
            </FormSelect>
        </FormField>
        <FormRow>
            <FormField label="Date">
                <FormInput v-model="date" type="date" />
            </FormField>
            <FormField label="Time">
                <FormInput v-model="time" type="time" />
            </FormField>
        </FormRow>
        <FormField label="Appointment Type">
            <FormSelect v-model="type">
                <option
                    v-for="appointmentType in appointmentTypes"
                    :key="appointmentType"
                >
                    {{ appointmentType }}
                </option>
            </FormSelect>
        </FormField>
        <FormField label="Blood-Test Level">
            <FormInput v-model="bloodTestLevel" type="number" />
        </FormField>
        <FormField label="Adverse Events">
            <div class="space-y-2">
                <div
                    v-for="(_, index) in adverseEvents"
                    :key="index"
                    class="flex gap-2"
                >
                    <FormInput
                        v-model="adverseEvents[index]"
                        placeholder="e.g. Mild fatigue"
                    />
                    <button
                        class="rounded-[5px] border border-rule bg-bg px-3 text-xs font-semibold text-muted"
                        type="button"
                        @click="removeAdverseEvent(index)"
                    >
                        Remove
                    </button>
                </div>
                <ActionButton @click="addAdverseEvent"
                    >Add Adverse Event</ActionButton
                >
            </div>
        </FormField>
        <FormField label="Clinical Note">
            <FormTextarea v-model="note" />
        </FormField>
        <template #footer>
            <ActionButton @click="$emit('close')">Cancel</ActionButton>
            <ActionButton
                variant="jh"
                :disabled="!patientOptions.length"
                @click="save"
                >Save Appointment</ActionButton
            >
        </template>
    </ModalShell>
</template>
