<script setup lang="ts">
import { computed } from "vue";

import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import TrialBanner from "@/components/Trials/TrialBanner.vue";
import type { Trial } from "@/types";

const props = defineProps<{ trial: Trial | null }>();

const items = computed(() => {
  if (!props.trial) return [];

  return [
    { label: "Trial ID", value: props.trial.id },
    { label: "Phase", value: props.trial.phase },
    { label: "Drug", value: props.trial.drug },
    { label: "Condition", value: props.trial.condition },
    { label: "Start Date", value: props.trial.start },
    { label: "Est. End", value: props.trial.end },
    { label: "Target Enrollment", value: props.trial.enrollment ?? "-" },
    { label: "Doses per Patient", value: props.trial.dosesPerPatient },
  ];
});
</script>

<template>
  <div v-if="trial" class="flex min-h-0 flex-1 flex-col">
    <TrialBanner :trial="trial" />
    <main class="p-7">
      <section class="overflow-hidden rounded-[5px] border border-rule bg-surface">
        <div class="border-b border-rule px-[18px] py-3 font-serif text-xl">
          Trial Details
        </div>
        <DetailGrid :items="items" />
      </section>
    </main>
  </div>
</template>
