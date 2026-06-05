<script setup lang="ts">
import { ActionButton, DataCard, DataTable, StatusBadge } from "@/components";
import { computed } from "vue";

import { allEligibleDosed, completedDoseCount } from "@/composables";
import { useAuthStore, useUiStore } from "@/stores";
import type {
    Patient,
    Trial,
    TrialAssignmentMap,
    TrialEnrollmentMap,
} from "@/types";

const props = defineProps<{
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
}>();

const auth = useAuthStore();
const ui = useUiStore();
const completed = computed(() =>
    completedDoseCount(props.trial, props.patients, props.enrollments),
);
const allDone = computed(() =>
    allEligibleDosed(props.trial, props.patients, props.enrollments),
);
const canNotify = computed(
    () =>
        auth.selectedPortalId === "jh-admin" &&
        props.trial.assignmentsLocked &&
        allDone.value &&
        !props.trial.notifiedFDA,
);
const message = computed(() => {
    if (props.trial.notifiedFDA)
        return "Results have already been transmitted to the FDA for this trial.";
    if (!props.trial.assignmentsLocked)
        return "Drug assignments must be locked before Jane Hopkins can notify the FDA.";
    if (!allDone.value)
        return `Not ready - ${completed.value}/${props.patients.length} eligible patients have completed all doses.`;
    return "All eligible patients have completed dosing. You may now notify the FDA.";
});

function assignmentLabel(patientId: string) {
    const assignment = props.assignments[patientId];
    if (!assignment) return "Unassigned";
    return assignment.drug === "bavaria"
        ? "Bavaria (Treatment)"
        : "Placebo (Control)";
}

function assignmentTone(patientId: string) {
    const assignment = props.assignments[patientId];
    if (!assignment) return "gray";
    return assignment.drug === "bavaria" ? "red" : "blue";
}
</script>

<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
                <div class="font-serif text-2xl font-normal">Notify FDA</div>
                <div class="mt-0.5 text-[13px] text-muted">
                    Transmit anonymized results once all dosing is complete.
                </div>
            </div>
            <ActionButton
                v-if="auth.selectedPortalId === 'jh-admin'"
                class="min-h-12 w-full px-7 text-base sm:w-auto lg:min-h-16 lg:min-w-40 lg:px-10 lg:text-lg"
                variant="jh"
                :disabled="!canNotify"
                @click="ui.showModal('notify-fda')"
            >
                Send Results to FDA
            </ActionButton>
        </div>
        <div
            class="mb-5 rounded-md border px-3 py-2 text-sm"
            :class="
                allDone && trial.assignmentsLocked
                    ? 'border-[#b8dfc5] bg-[#e6f4ec] text-[#1e7e4e]'
                    : 'border-[#f3d7a2] bg-[#fff8e8] text-[#8a5a00]'
            "
        >
            {{ message }}
        </div>
        <DataCard title="Disclosure Preview">
            <DataTable>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>UUID</th>
                        <th>DOB</th>
                        <th>Group</th>
                        <th>Tracking ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!patients.length">
                        <td colspan="5" class="text-muted">
                            No eligible patients available.
                        </td>
                    </tr>
                    <tr v-for="patient in patients" :key="patient.id">
                        <td>{{ patient.name }}</td>
                        <td class="font-mono text-xs text-fda">
                            {{ patient.id }}
                        </td>
                        <td>{{ patient.dob }}</td>
                        <td>
                            <StatusBadge :tone="assignmentTone(patient.id)">
                                {{ assignmentLabel(patient.id) }}
                            </StatusBadge>
                        </td>
                        <td class="font-mono text-xs text-fda">
                            {{ assignments[patient.id]?.trackingId ?? "-" }}
                        </td>
                    </tr>
                </tbody>
            </DataTable>
        </DataCard>
    </div>
</template>
