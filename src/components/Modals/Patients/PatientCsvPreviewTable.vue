<script setup lang="ts">
import { DataCard, DataTable, StatCard, StatusBadge } from "@/components";
import type { PatientCsvPreviewRow } from "@/composables";

defineProps<{
    rows: PatientCsvPreviewRow[];
    validCount: number;
    eligibleCount: number;
}>();
</script>

<template>
    <template v-if="rows.length">
        <div class="my-4 grid grid-cols-3 gap-3">
            <StatCard label="Total Rows">{{ rows.length }}</StatCard>
            <StatCard label="Valid">{{ validCount }}</StatCard>
            <StatCard label="Eligible">{{ eligibleCount }}</StatCard>
        </div>
        <DataCard title="Preview">
            <DataTable>
                <thead>
                    <tr>
                        <th>Row</th>
                        <th>Patient</th>
                        <th>ICD-10</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.rowNum">
                        <td class="font-mono text-xs text-fda">
                            {{ row.rowNum }}
                        </td>
                        <td>
                            <strong>{{ row.patient?.name || "-" }}</strong>
                            <div class="font-mono text-xs text-fda">
                                {{ row.patient?.id || "-" }}
                            </div>
                        </td>
                        <td>{{ row.patient?.icdCodes.join(", ") || "-" }}</td>
                        <td>
                            <StatusBadge
                                :tone="
                                    row.errors.length
                                        ? 'red'
                                        : row.eligible
                                          ? 'green'
                                          : 'gray'
                                "
                            >
                                {{
                                    row.errors.length
                                        ? row.errors.join(", ")
                                        : row.eligible
                                          ? "Eligible"
                                          : "Will be excluded"
                                }}
                            </StatusBadge>
                        </td>
                    </tr>
                </tbody>
            </DataTable>
        </DataCard>
    </template>
</template>
