<script setup lang="ts">
import {
    ActionButton,
    AssignmentPreviewTable,
    ModalShell,
    StatCard,
} from "@/components";
import { computed, ref, watch } from "vue";

import {
    assignmentCounts,
    calculateTreatmentPatientCounts,
    createAssignments,
} from "@/composables";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type {
    Patient,
    Trial,
    TrialAssignmentMap,
    TrialEnrollmentMap,
} from "@/types";

const props = defineProps<{
    open: boolean;
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
}>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuthStore();
const trials = useTrialsStore();
const ui = useUiStore();
const draft = ref<TrialAssignmentMap>({});

const counts = computed(() => assignmentCounts(draft.value));
const targetCounts = computed(() =>
    calculateTreatmentPatientCounts(
        props.patients.length,
        props.trial.treatmentPct ?? 50,
    ),
);
const fullyAssigned = computed(
    () =>
        props.patients.length > 0 &&
        props.patients.every(
            (patient) => draft.value[patient.id]?.patientId === patient.id,
        ),
);
const canLock = computed(
    () =>
        auth.selectedPortalId === "fda" &&
        props.trial.batchSubmitted &&
        fullyAssigned.value,
);

watch(
    () => props.open,
    (open) => {
        if (open) draft.value = { ...props.assignments };
    },
);

function randomize() {
    draft.value = createAssignments(
        props.patients,
        props.trial.treatmentPct ?? 50,
    );
    ui.pushToast("Patients randomly assigned.", "info");
}

function lock() {
    const saved = trials.saveAssignments(
        props.trial.id,
        draft.value,
        auth.selectedPortalId,
    );
    if (!saved) {
        ui.pushToast(
            "Assignments can only be locked by FDA after Bavaria submits a batch.",
            "error",
        );
        return;
    }

    ui.pushToast("Drug assignments locked.", "success");
    emit("close");
}
</script>

<template>
    <ModalShell
        :open="open"
        title="Randomized Drug Assignment"
        wide
        @close="$emit('close')"
    >
        <p
            class="mb-4 rounded-md border border-[#f3d7a2] bg-[#fff8e8] px-3 py-2 text-sm text-[#8a5a00]"
        >
            This mapping is strictly confidential. It remains hidden from Jane
            Hopkins and Bavaria until FDA disclosure.
        </p>
        <div
            class="mb-4 grid grid-cols-4 gap-3 max-[780px]:grid-cols-2 max-[520px]:grid-cols-1"
        >
            <StatCard label="Eligible Patients">{{ patients.length }}</StatCard>
            <StatCard label="Target Split"
                >{{ targetCounts.treatmentPatients }} /
                {{ targetCounts.placeboPatients }}</StatCard
            >
            <StatCard label="Treatment Group">{{ counts.treatment }}</StatCard>
            <StatCard label="Placebo Group">{{ counts.placebo }}</StatCard>
        </div>
        <AssignmentPreviewTable
            :patients="patients"
            :enrollments="enrollments"
            :assignments="draft"
            :doses-per-patient="trial.dosesPerPatient"
            :locked="false"
        />
        <template #footer>
            <ActionButton @click="randomize">Randomize</ActionButton>
            <ActionButton variant="fda" :disabled="!canLock" @click="lock"
                >Lock Assignments</ActionButton
            >
        </template>
    </ModalShell>
</template>
