<script setup lang="ts">
import type { TrialTab } from "@/types";

defineProps<{ tabs: TrialTab[]; active: TrialTab }>();
defineEmits<{ change: [tab: TrialTab] }>();

const labels: Record<TrialTab, string> = {
    overview: "Overview",
    patients: "Patients",
    appointments: "Appointments",
    doses: "Dose Tracker",
    notify: "Notify FDA",
    assignments: "Assignments",
    disclose: "Disclose",
    batch: "Drug Batch",
    report: "Report",
};
</script>

<template>
    <div
        class="flex w-full shrink-0 justify-start overflow-x-auto overflow-y-hidden border-b border-rule bg-surface px-2 [-webkit-overflow-scrolling:touch] sm:px-4 md:px-7"
    >
        <button
            v-for="tab in tabs"
            :key="tab"
            class="relative shrink-0 whitespace-nowrap border-0 bg-transparent px-2 py-[15px] text-center text-[11px] font-medium sm:px-3 sm:text-xs md:px-[18px] md:py-[18px] md:text-[13px]"
            :class="
                tab === active
                    ? 'font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-jh'
                    : 'text-muted'
            "
            type="button"
            @click="$emit('change', tab)"
        >
            {{ labels[tab] }}
        </button>
    </div>
</template>
