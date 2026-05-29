<script setup lang="ts">
import { computed } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import TrialBanner from "@/components/Trials/TrialBanner.vue";
import { statusBadges } from "@/composables";
import type { Trial } from "@/types";

const props = defineProps<{ trial: Trial | null }>();

const statusLabel = computed(() => {
  if (!props.trial) return "-";
  return statusBadges(props.trial)
    .filter((badge) => badge.label !== "Archived")
    .map((badge) => badge.label)
    .join(", ");
});

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
      <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <div class="font-serif text-2xl font-normal">Trial Overview</div>
          <div class="mt-0.5 text-[13px] text-muted">{{ trial.description }}</div>
        </div>
      </div>
      <div class="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <StatCard label="Target Enrollment" sub="planned participants">
          {{ trial.enrollment }}
        </StatCard>
        <StatCard label="Trial Status" sub="current workflow state">
          {{ statusLabel }}
        </StatCard>
        <StatCard label="Phase" sub="clinical stage">
          {{ trial.phase }}
        </StatCard>
        <StatCard label="Doses" sub="per patient">
          {{ trial.dosesPerPatient }}
        </StatCard>
      </div>
      <DataCard title="Trial Details">
        <DetailGrid :items="items" />
      </DataCard>
    </main>
  </div>
</template>
