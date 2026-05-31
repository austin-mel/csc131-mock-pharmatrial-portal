<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import ActionButton from '@/components/ActionButton/ActionButton.vue';
import DetailGrid from '@/components/Dashboard/DetailGrid.vue';
import FormField from '@/components/Form/FormField.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import ModalShell from '@/components/ModalShell/ModalShell.vue';
import { checkEligibility } from '@/composables';
import { useAuthStore, usePatientsStore, useTrialsStore, useUiStore } from '@/stores';
import type { Trial, TrialEligibility } from '@/types';

const props = defineProps<{ open: boolean; trial: Trial | null }>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuthStore();
const patients = usePatientsStore();
const trials = useTrialsStore();
const ui = useUiStore();

const notes = ref('');
const includeIcd = ref('');
const excludeIcd = ref('');
const minAge = ref(18);
const incompatMeds = ref('');

const enrollmentCount = computed(() => (props.trial ? Object.keys(trials.enrollmentsFor(props.trial.id)).length : 0));
const jhApprovalBlocked = computed(() => auth.selectedPortalId === 'jh-admin' && enrollmentCount.value === 0);
const canReview = computed(() => auth.selectedPortalId === 'fda' || auth.selectedPortalId === 'jh-admin');

const items = computed(() => {
  if (!props.trial) return [];
  return [
    { label: 'Trial ID', value: props.trial.id },
    { label: 'Drug', value: props.trial.drug },
    { label: 'Phase', value: props.trial.phase },
    { label: 'Condition', value: props.trial.condition },
    { label: 'Start Date', value: props.trial.start },
    { label: 'Estimated End', value: props.trial.end },
    { label: 'Target Enrollment', value: props.trial.enrollment },
    { label: 'Enrolled Patients', value: enrollmentCount.value },
  ];
});

watch(
  () => props.open,
  (open) => {
    if (!open || !props.trial) return;
    const eligibility = props.trial.eligibility;
    notes.value = '';
    includeIcd.value = eligibility?.includeIcd.join(', ') ?? '';
    excludeIcd.value = eligibility?.excludeIcd.join(', ') ?? '';
    minAge.value = eligibility?.minAge ?? 18;
    incompatMeds.value = eligibility?.incompatMeds.join(', ') ?? '';
  },
);

function list(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function eligibilityDraft(): TrialEligibility {
  return {
    includeIcd: list(includeIcd.value),
    excludeIcd: list(excludeIcd.value),
    minAge: Number(minAge.value) || 18,
    incompatMeds: list(incompatMeds.value),
  };
}

function approve() {
  if (!props.trial || !canReview.value) return;
  const eligibility = auth.selectedPortalId === 'fda' ? eligibilityDraft() : undefined;
  const approved = trials.approveTrial(props.trial.id, auth.selectedPortalId, eligibility);
  if (!approved) {
    ui.pushToast(jhApprovalBlocked.value ? 'Assign at least 1 patient before approving.' : 'Trial cannot be approved from its current state.', 'error');
    return;
  }

  if (eligibility) {
    const trial = trials.trials.find((item) => item.id === props.trial?.id);
    if (trial) {
      Object.keys(trials.enrollmentsFor(trial.id)).forEach((patientId) => {
        const patient = patients.getPatient(patientId);
        if (patient) trials.enrollPatient(trial.id, patientId, checkEligibility(patient, trial));
      });
    }
  }

  ui.pushToast('Trial approved.', 'success');
  emit('close');
}

function reject() {
  if (!props.trial || !canReview.value) return;
  const rejected = trials.rejectTrial(props.trial.id, auth.selectedPortalId);
  if (!rejected) {
    ui.pushToast('Trial cannot be rejected from its current state.', 'error');
    return;
  }
  ui.pushToast('Trial rejected.', 'error');
  emit('close');
}
</script>

<template>
  <ModalShell
    :open="open"
    title="Review Trial"
    @close="$emit('close')"
  >
    <DetailGrid v-if="trial" :items="items" />
    <template v-if="trial && auth.selectedPortalId === 'fda'">
      <div class="mb-2 mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-muted">
        Eligibility Criteria
      </div>
      <FormField label="Required ICD-10 Codes">
        <FormInput v-model="includeIcd" placeholder="B20, Z21" />
      </FormField>
      <FormField label="Excluded ICD-10 Codes">
        <FormInput v-model="excludeIcd" placeholder="Z34, O00, O99" />
      </FormField>
      <FormField label="Minimum Age">
        <FormInput v-model="minAge" type="number" />
      </FormField>
      <FormField label="Incompatible Medications">
        <FormInput v-model="incompatMeds" placeholder="Tenofovir, Abacavir" />
      </FormField>
    </template>
    <FormField label="Review Notes">
      <FormTextarea v-model="notes" placeholder="Add conditions or notes..." />
    </FormField>
    <div
      v-if="jhApprovalBlocked"
      class="mt-3 rounded-md border border-[#e4d4a0] bg-[#fff7d6] px-3 py-2 text-sm font-semibold text-[#6f4e00]"
    >
      Assign at least 1 patient before Jane Hopkins can approve this trial.
    </div>
    <template #footer>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ActionButton
          class="min-h-14 w-full px-8 text-base sm:w-auto sm:min-w-40"
          variant="danger"
          @click="reject"
        >
          Reject Trial
        </ActionButton>
        <ActionButton
          class="min-h-14 w-full px-8 text-base sm:w-auto sm:min-w-40"
          :variant="auth.selectedPortalId === 'fda' ? 'fda' : 'jh'"
          :disabled="jhApprovalBlocked"
          @click="approve"
        >
          Approve Trial
        </ActionButton>
      </div>
    </template>
  </ModalShell>
</template>
