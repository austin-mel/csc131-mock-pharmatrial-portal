<script setup lang="ts">
import { StatusBadge } from "@/components";

defineProps<{
    patientId: string;
    name: string;
    initials: string;
    eligible: boolean;
    enrolled: boolean;
    doses: number;
    totalDoses: number;
    bannerClass: string;
    showEligibilityReview: boolean;
}>();
</script>

<template>
    <div
        :class="bannerClass"
        class="-m-[22px] mb-[22px] flex items-center gap-[18px] p-[22px] text-white"
    >
        <div
            class="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-white/20 font-serif text-[21px]"
        >
            {{ initials }}
        </div>
        <div class="min-w-0">
            <div class="font-serif text-xl">{{ name }}</div>
            <div class="mt-0.5 font-mono text-[11px] text-white/60">
                {{ patientId }}
            </div>
            <div class="mt-2 flex flex-wrap gap-[7px]">
                <StatusBadge
                    v-if="showEligibilityReview"
                    :tone="eligible ? 'green' : 'gray'"
                >
                    {{ eligible ? "Eligible" : "Excluded" }}
                </StatusBadge>
                <StatusBadge tone="blue">
                    {{ enrolled ? "Enrolled" : "Not enrolled" }}
                </StatusBadge>
                <StatusBadge :tone="doses >= totalDoses ? 'green' : 'yellow'">
                    {{ doses }}/{{ totalDoses }} doses
                </StatusBadge>
            </div>
        </div>
    </div>
</template>
