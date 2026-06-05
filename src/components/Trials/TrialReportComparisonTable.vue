<script setup lang="ts">
import { DataCard, DataTable, StatusBadge } from "@/components";

defineProps<{
    treatmentCount: number;
    placeboCount: number;
    treatmentAverage: string;
    placeboAverage: string;
    treatmentAdverseEvents: number;
    placeboAdverseEvents: number;
}>();
</script>

<template>
    <DataCard title="Treatment / Placebo Comparison">
        <DataTable>
            <thead>
                <tr>
                    <th>Group</th>
                    <th>Patients</th>
                    <th>Average Reduction</th>
                    <th>Adverse Events</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <StatusBadge tone="red">Treatment</StatusBadge>
                    </td>
                    <td>{{ treatmentCount }}</td>
                    <td>{{ treatmentAverage }}</td>
                    <td>{{ treatmentAdverseEvents }}</td>
                </tr>
                <tr>
                    <td>
                        <StatusBadge tone="blue">Placebo</StatusBadge>
                    </td>
                    <td>{{ placeboCount }}</td>
                    <td>{{ placeboAverage }}</td>
                    <td>{{ placeboAdverseEvents }}</td>
                </tr>
            </tbody>
        </DataTable>
    </DataCard>
</template>
