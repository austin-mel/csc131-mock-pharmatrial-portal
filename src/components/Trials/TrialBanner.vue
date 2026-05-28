<script setup lang="ts">
import { computed } from "vue";

import StatusBadge from "../StatusBadge/StatusBadge.vue";
import { statusBadges } from "@/composables";
import type { Trial } from "@/types";

const props = withDefaults(
  defineProps<{ trial: Trial; eligibleCount?: number; completedCount?: number }>(),
  { eligibleCount: 0, completedCount: 0 },
);

const badges = computed(() => statusBadges(props.trial));
const pills = computed(() => [
  { value: props.trial.drug, label: "Drug" },
  { value: props.trial.condition, label: "Condition" },
  { value: props.trial.start, label: "Start" },
  { value: `${props.trial.dosesPerPatient} doses`, label: "Per Patient" },
  { value: props.eligibleCount, label: "Eligible" },
  { value: `${props.completedCount}/${props.eligibleCount}`, label: "Fully Dosed" },
]);
</script>

<template>
  <section
    class="banner flex flex-wrap items-start justify-between gap-4 bg-ink px-7 py-[22px] text-white"
  >
    <div>
      <div class="mb-[5px] flex gap-1.5">
        <StatusBadge
          v-for="badge in badges"
          :key="badge.label"
          :tone="badge.tone"
        >
          {{ badge.label }}
        </StatusBadge>
      </div>
      <div class="mb-[3px] font-serif text-[22px] leading-[1.2]">
        {{ trial.name }}
      </div>
      <div class="mb-2.5 font-mono text-[11px] text-white/45">
        {{ trial.id }} - Bavaria Pharma - {{ trial.phase }}
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="pill in pills"
          :key="pill.label"
          class="flex min-w-[90px] flex-col rounded-[5px] border border-white/10 bg-white/10 px-3 py-1.5 font-mono text-[10px] text-white/40"
        >
          <strong class="font-sans text-xs text-white/90">{{ pill.value }}</strong>
          {{ pill.label }}
        </span>
      </div>
    </div>
  </section>
</template>
