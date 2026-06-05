<script setup lang="ts">
import { DataCard, DataTable } from "@/components";

defineProps<{
    rows: Array<{
        patientId: string;
        patientName: string;
        adverseEventCount: number;
        adverseEvents: string;
    }>;
}>();
</script>

<template>
    <DataCard title="Adverse Event Detail">
        <DataTable>
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Event Count</th>
                    <th>Events</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!rows.length">
                    <td colspan="3" class="text-muted">
                        No adverse events recorded.
                    </td>
                </tr>
                <tr v-for="row in rows" :key="row.patientId">
                    <td>{{ row.patientName }}</td>
                    <td>{{ row.adverseEventCount }}</td>
                    <td>{{ row.adverseEvents }}</td>
                </tr>
            </tbody>
        </DataTable>
    </DataCard>
</template>
