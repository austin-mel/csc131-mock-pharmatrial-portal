<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import FormField from "@/components/Form/FormField.vue";
import FormInput from "@/components/Form/FormInput.vue";
import FormRow from "@/components/Form/FormRow.vue";
import FormTextarea from "@/components/Form/FormTextarea.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import { calculateBatch, canSubmitBatch } from "@/composables";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type { Trial } from "@/types";

const props = defineProps<{ open: boolean; trial: Trial; eligibleCount: number }>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuthStore();
const trials = useTrialsStore();
const ui = useUiStore();

const batchRef = ref("");
const dosesPerPatient = ref<number | null>(1);
const treatmentPct = ref<number | null>(50);
const manufactureDate = ref("");
const lotNumber = ref("");
const shippingNotes = ref("");

const draftTrial = computed<Trial>(() => ({
  ...props.trial,
  dosesPerPatient: Number(dosesPerPatient.value) || props.trial.dosesPerPatient,
  treatmentPct: Number(treatmentPct.value) || 50,
}));
const batch = computed(() => calculateBatch(props.eligibleCount, draftTrial.value));
const canSubmit = computed(() => auth.selectedPortalId === "bavaria" && canSubmitBatch(props.trial));

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    batchRef.value = props.trial.batchRef ?? `BAV-${props.trial.id}-BATCH-001`;
    dosesPerPatient.value = props.trial.dosesPerPatient;
    treatmentPct.value = props.trial.treatmentPct ?? 50;
    manufactureDate.value = props.trial.manufactureDate ?? new Date().toISOString().slice(0, 10);
    lotNumber.value = props.trial.lotNumber ?? `LOT-${props.trial.id.replace(/\D/g, "") || "001"}`;
    shippingNotes.value = props.trial.shippingNotes ?? "Store at 2-8C. Handle with care. Do not freeze.";
  },
);

function submit() {
  const submitted = trials.submitBatch(
    props.trial.id,
    {
      batchRef: batchRef.value || `BAV-${props.trial.id}-BATCH-001`,
      dosesPerPatient: Number(dosesPerPatient.value) || props.trial.dosesPerPatient,
      treatmentPct: Number(treatmentPct.value) || 50,
      manufactureDate: manufactureDate.value,
      lotNumber: lotNumber.value,
      shippingNotes: shippingNotes.value,
    },
    auth.selectedPortalId,
  );

  if (!submitted) {
    ui.pushToast("Batch cannot be submitted until FDA and Jane Hopkins approvals are complete.", "error");
    return;
  }

  ui.pushToast("Drug batch submitted to FDA.", "success");
  emit("close");
}
</script>

<template>
  <ModalShell :open="open" title="Submit Drug Batch" @close="$emit('close')">
    <p class="mb-4 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted">
      Total vials are calculated from eligible patients and doses per patient. Submitting a new batch clears any stale FDA assignments.
    </p>
    <FormField label="Batch Reference Code">
      <FormInput v-model="batchRef" />
    </FormField>
    <FormRow>
      <FormField label="Doses Per Patient">
        <FormInput v-model="dosesPerPatient" type="number" min="1" />
      </FormField>
      <FormField label="Eligible Patients">
        <FormInput :model-value="eligibleCount" readonly />
      </FormField>
    </FormRow>
    <FormField :label="`Treatment Percent: ${Number(treatmentPct) || 50}%`">
      <input
        v-model="treatmentPct"
        class="w-full accent-bav"
        type="range"
        min="10"
        max="90"
        step="5"
      />
    </FormField>
    <FormRow>
      <FormField label="Manufacture Date">
        <FormInput v-model="manufactureDate" type="date" />
      </FormField>
      <FormField label="Lot Number">
        <FormInput v-model="lotNumber" />
      </FormField>
    </FormRow>
    <FormField label="Shipping Notes">
      <FormTextarea v-model="shippingNotes" />
    </FormField>
    <div class="mt-3 grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
      <StatCard label="Total Vials">{{ batch.totalVials }}</StatCard>
      <StatCard label="Bavaria Drug">{{ batch.treatment }}</StatCard>
      <StatCard label="Placebo">{{ batch.placebo }}</StatCard>
    </div>
    <template #footer>
      <ActionButton @click="$emit('close')">Cancel</ActionButton>
      <ActionButton variant="bav" :disabled="!canSubmit" @click="submit">Submit Batch</ActionButton>
    </template>
  </ModalShell>
</template>

