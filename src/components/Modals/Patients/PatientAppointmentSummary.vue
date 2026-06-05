<script setup lang="ts">
import { DataCard, DetailGrid, PaginationControls } from "@/components";
import type { Appointment } from "@/types";

defineProps<{
    appointment: Appointment | null;
    appointmentItems: Array<{ label: string; value: string | number }>;
    page: number;
    count: number;
}>();

defineEmits<{ change: [delta: number] }>();
</script>

<template>
    <DataCard v-if="count" class="mt-5" title="Appointments">
        <template #header>
            <span class="font-mono text-xs text-fda"
                >{{ page }}/{{ count }}</span
            >
        </template>
        <div class="p-[18px]">
            <div class="mb-3 rounded-md border border-rule bg-bg p-4">
                <div
                    class="mb-3 flex flex-wrap items-center justify-between gap-2"
                >
                    <strong>{{ appointment?.type }}</strong>
                    <span class="font-mono text-xs text-fda"
                        >{{ appointment?.date }}
                        {{ appointment?.time ?? "" }}</span
                    >
                </div>
                <DetailGrid :items="appointmentItems" />
            </div>
            <PaginationControls
                :page="page"
                :pages="count"
                @change="$emit('change', $event)"
            />
        </div>
    </DataCard>
    <DataCard v-else class="mt-5" title="Appointments">
        <div class="p-[18px] text-sm text-muted">
            No appointments logged for this patient.
        </div>
    </DataCard>
</template>
