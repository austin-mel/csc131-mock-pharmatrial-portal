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
const canDisclose = computed(
    () =>
        auth.selectedPortalId === "fda" &&
        props.trial.notifiedFDA &&
        props.trial.assignmentsLocked &&
        allDone.value &&
        !props.trial.disclosed,
);
const message = computed(() => {
    if (props.trial.disclosed)
        return "Assignments have been disclosed. This trial is now complete.";
    if (!props.trial.assignmentsLocked)
        return "Drug assignments must be locked before disclosure is available.";
    if (!props.trial.notifiedFDA)
        return "Jane Hopkins must notify the FDA before disclosure can proceed.";
    if (!allDone.value)
        return `Disclosure locked - only ${completed.value}/${props.patients.length} eligible patients have completed all doses.`;
    return "All conditions met. You may now publish the final report.";
});

function patientComplete(patientId: string) {
    return (
        (props.enrollments[patientId]?.doses ?? 0) >=
        props.trial.dosesPerPatient
    );
}
</script>

<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
                <div class="font-serif text-2xl font-normal">
                    End-of-Trial Disclosure
                </div>
                <div class="mt-0.5 text-[13px] text-muted">
                    Reveal treatment assignments to all parties for
                    {{ trial.name }}.
                </div>
            </div>
            <ActionButton
                v-if="auth.selectedPortalId === 'fda'"
                class="min-h-12 w-full px-7 text-base sm:w-auto lg:min-h-16 lg:min-w-40 lg:px-10 lg:text-lg"
                variant="danger"
                :disabled="!canDisclose"
                @click="ui.showModal('disclose-trial')"
            >
                Send Report
            </ActionButton>
        </div>
        <div
            class="mb-5 rounded-md border px-3 py-2 text-sm"
            :class="
                trial.disclosed || canDisclose
                    ? 'border-[#b8dfc5] bg-[#e6f4ec] text-[#1e7e4e]'
                    : 'border-[#f3d7a2] bg-[#fff8e8] text-[#8a5a00]'
            "
        >
            {{ message }}
        </div>
        <DataCard title="Results Preview (Anonymized)">
            <template #header>
                <StatusBadge>No PII</StatusBadge>
            </template>
            <DataTable>
                <thead>
                    <tr>
                        <th>UUID</th>
                        <th>Doses</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!patients.length">
                        <td colspan="3" class="text-muted">
                            No eligible patients available.
                        </td>
                    </tr>
                    <tr v-for="patient in patients" :key="patient.id">
                        <td class="font-mono text-xs text-fda">
                            {{ patient.id }}
                        </td>
                        <td>
                            {{ enrollments[patient.id]?.doses ?? 0 }}/{{
                                trial.dosesPerPatient
                            }}
                        </td>
                        <td>
                            <StatusBadge
                                :tone="
                                    patientComplete(patient.id)
                                        ? 'green'
                                        : 'yellow'
                                "
                            >
                                {{
                                    patientComplete(patient.id)
                                        ? "Complete"
                                        : "In Progress"
                                }}
                            </StatusBadge>
                        </td>
                    </tr>
                </tbody>
            </DataTable>
        </DataCard>
    </div>
</template>
