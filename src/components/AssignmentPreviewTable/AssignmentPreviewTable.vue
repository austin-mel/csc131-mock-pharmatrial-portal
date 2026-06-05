<script setup lang="ts">
import { DataCard, DataTable, StatusBadge } from "@/components";
import { computed } from "vue";

import type { Patient, TrialAssignmentMap, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
    dosesPerPatient?: number;
    locked?: boolean;
}>();

const locked = computed(() => Boolean(props.locked));
const statusLabel = computed(() => (locked.value ? "Locked" : "Draft"));

function tone(patientId: string) {
    const drug = props.assignments[patientId]?.drug;
    if (drug === "bavaria") return "red";
    if (drug === "placebo") return "blue";
    return "gray";
}

function label(patientId: string) {
    const drug = props.assignments[patientId]?.drug;
    if (drug === "bavaria") return "Bavaria";
    if (drug === "placebo") return "Placebo";
    return "Unassigned";
}

function remaining(patientId: string) {
    if (!props.dosesPerPatient) return props.enrollments[patientId]?.doses ?? 0;
    return Math.max(
        0,
        props.dosesPerPatient - (props.enrollments[patientId]?.doses ?? 0),
    );
}
</script>

<template>
    <DataCard title="UUID to Drug Mapping">
        <template #header>
            <StatusBadge :tone="locked ? 'green' : 'yellow'">
                {{ statusLabel }}
            </StatusBadge>
        </template>
        <DataTable>
            <thead>
                <tr>
                    <th>Patient UUID</th>
                    <th>Assigned Drug</th>
                    <th>Tracking ID</th>
                    <th>Doses Remaining</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in patients" :key="patient.id">
                    <td class="font-mono text-xs text-fda">{{ patient.id }}</td>
                    <td>
                        <StatusBadge :tone="tone(patient.id)">
                            {{ label(patient.id) }}
                        </StatusBadge>
                    </td>
                    <td class="font-mono text-xs text-fda">
                        {{ assignments[patient.id]?.trackingId ?? "-" }}
                    </td>
                    <td>{{ remaining(patient.id) }}</td>
                </tr>
            </tbody>
        </DataTable>
    </DataCard>
</template>
