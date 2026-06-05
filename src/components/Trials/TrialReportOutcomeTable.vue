<script setup lang="ts">
import { DataCard, DataTable, StatusBadge } from "@/components";

type StatusTone = "gray" | "green" | "blue" | "yellow" | "orange" | "red";

defineProps<{
    rows: Array<{
        patientId: string;
        patientName: string;
        groupTone: StatusTone;
        groupLabel: string;
        startValue: string | number;
        endValue: string | number;
        reductionLabel: string;
        adverseEvents: string;
    }>;
}>();
</script>

<template>
    <DataCard title="Outcome by Patient">
        <DataTable>
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>UUID</th>
                    <th>Group</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reduction</th>
                    <th>Adverse Events</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!rows.length">
                    <td colspan="7" class="text-muted">
                        No eligible assigned patients are ready for reporting.
                    </td>
                </tr>
                <tr v-for="row in rows" :key="row.patientId">
                    <td>
                        <strong>{{ row.patientName }}</strong>
                    </td>
                    <td class="font-mono text-xs text-fda">
                        {{ row.patientId }}
                    </td>
                    <td>
                        <StatusBadge :tone="row.groupTone">
                            {{ row.groupLabel }}
                        </StatusBadge>
                    </td>
                    <td>{{ row.startValue }}</td>
                    <td>{{ row.endValue }}</td>
                    <td>{{ row.reductionLabel }}</td>
                    <td>{{ row.adverseEvents }}</td>
                </tr>
            </tbody>
        </DataTable>
    </DataCard>
</template>
