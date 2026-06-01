<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import { calculateBatch, canSubmitBatch } from "@/composables";
import { useUiStore } from "@/stores";
import type { Trial } from "@/types";

const props = defineProps<{ trial: Trial; eligibleCount: number }>();

const ui = useUiStore();
const allApproved = computed(() => canSubmitBatch(props.trial));
const batch = computed(() => calculateBatch(props.eligibleCount, props.trial));
const submittedItems = computed(() => [
  { label: "Batch Reference", value: props.trial.batchRef ?? "-" },
  { label: "Total Vials", value: batch.value.totalVials },
  { label: "Doses per Patient", value: props.trial.dosesPerPatient },
  { label: "Treatment / Placebo Split", value: `${props.trial.treatmentPct ?? 50}% / ${100 - (props.trial.treatmentPct ?? 50)}%` },
  { label: "Bavaria Drug", value: `${batch.value.treatment} vials` },
  { label: "Placebo", value: `${batch.value.placebo} vials` },
  { label: "Manufacture Date", value: props.trial.manufactureDate ?? "-" },
  { label: "Lot Number", value: props.trial.lotNumber ?? "-" },
  { label: "Shipping Notes", value: props.trial.shippingNotes ?? "-" },
  { label: "Status", value: "Received by FDA" },
]);
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
      <div>
        <div class="font-serif text-2xl font-normal">Drug Batch</div>
        <div class="mt-0.5 text-[13px] text-muted">Submit labeled vials to the FDA for {{ trial.name }}.</div>
      </div>
      <ActionButton
        v-if="!trial.batchSubmitted"
        variant="bav"
        :disabled="!allApproved"
        @click="ui.showModal('drug-batch')"
      >
        Prepare & Submit Drug Batch
      </ActionButton>
    </div>
    <div v-if="!allApproved" class="mb-5 rounded-md border border-[#f3d7a2] bg-[#fff8e8] px-3 py-2 text-sm text-[#8a5a00]">
      Drug batch cannot be submitted until both Jane Hopkins and the FDA approve this trial.
    </div>
    <template v-if="trial.batchSubmitted">
      <div class="mb-5 rounded-md border border-[#b8dfc5] bg-[#e6f4ec] px-3 py-2 text-sm text-[#1e7e4e]">
        Batch {{ trial.batchRef }} has been submitted and received by the FDA.
      </div>
      <DataCard title="Submitted Batch">
        <DetailGrid :items="submittedItems" />
      </DataCard>
    </template>
    <template v-else>
      <DataCard title="Batch Calculation">
        <div class="m-0 grid grid-cols-4 gap-3 px-[18px] py-4 max-[780px]:grid-cols-2 max-[520px]:grid-cols-1">
          <StatCard label="Eligible Patients">{{ eligibleCount }}</StatCard>
          <StatCard label="Doses Each">{{ trial.dosesPerPatient }}</StatCard>
          <StatCard label="Total Vials">{{ batch.totalVials }}</StatCard>
          <StatCard label="Default Split">{{ trial.treatmentPct ?? 50 }}% / {{ 100 - (trial.treatmentPct ?? 50) }}%</StatCard>
        </div>
      </DataCard>
    </template>
  </div>
</template>

