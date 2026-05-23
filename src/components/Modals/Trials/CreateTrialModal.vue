<script setup lang="ts">
import { ref, watch } from "vue";
import ActionButton from "../../ActionButton/ActionButton.vue";
import FormInput from "../../Form/FormInput.vue";
import FormSelect from "../../Form/FormSelect.vue";
import FormTextarea from "../../Form/FormTextarea.vue";
import FormField from "../../Form/FormField.vue";
import FormRow from "../../Form/FormRow.vue";
import ModalShell from "../../ModalShell/ModalShell.vue";
import { useTrialsStore } from "@/stores";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const trials = useTrialsStore();
const name = ref("");
const drug = ref("");
const phase = ref("Phase 3");
const condition = ref("");
const enrollment = ref(100);
const dosesPerPatient = ref(5);
const start = ref("2023-07-01");
const end = ref("2023-12-31");
const description = ref("");
const error = ref("");
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    name.value = "";
    drug.value = "";
    phase.value = "Phase 3";
    condition.value = "";
    enrollment.value = 100;
    dosesPerPatient.value = 5;
    start.value = "2023-07-01";
    end.value = "2023-12-31";
    description.value = "";
    error.value = "";
  },
);
function submit() {
  if (!name.value.trim() || !drug.value.trim()) {
    error.value = "Trial name and drug name are required.";
    return;
  }
  trials.createTrial({
    name: name.value.trim(),
    drug: drug.value.trim(),
    phase: phase.value,
    condition: condition.value,
    start: start.value,
    end: end.value,
    enrollment: Number(enrollment.value) || 100,
    dosesPerPatient: Number(dosesPerPatient.value) || 5,
    description: description.value,
  });
  emit("close");
}
</script>

<template>
  <ModalShell
    :open="open"
    title="Create New Clinical Trial"
    wide
    @close="$emit('close')"
  >
    <p
      class="mb-4 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted"
    >
      Bavaria-created trials appear in the current trial sidebar immediately
      after submission.
    </p>
    <FormField label="Trial Name">
      <FormInput v-model="name" placeholder="e.g. Phase 3 Antiviral Regimen B" />
    </FormField>
    <FormRow>
      <FormField label="Drug Name">
        <FormInput v-model="drug" placeholder="e.g. BAV-AV8" />
      </FormField>
      <FormField label="Phase">
        <FormSelect v-model="phase">
          <option>
            Phase 1
          </option>
          <option>
            Phase 2
          </option>
          <option>
            Phase 3
          </option>
        </FormSelect>
      </FormField>
    </FormRow>
    <FormField label="Condition Under Study">
      <FormInput v-model="condition" />
    </FormField>
    <FormRow>
      <FormField label="Target Enrollment">
        <FormInput v-model="enrollment" type="number" />
      </FormField>
      <FormField label="Doses Per Patient">
        <FormInput v-model="dosesPerPatient" type="number" />
      </FormField>
    </FormRow>
    <FormRow>
      <FormField label="Start Date">
        <FormInput v-model="start" type="date" />
      </FormField>
      <FormField label="Estimated End Date">
        <FormInput v-model="end" type="date" />
      </FormField>
    </FormRow>
    <FormField label="Description / Objectives">
      <FormTextarea v-model="description" />
    </FormField>
    <p v-if="error" class="mt-3 text-sm font-semibold text-bav">
      {{ error }}
    </p>
    <template #footer>
      <ActionButton @click="$emit('close')">
        Cancel
      </ActionButton>
      <ActionButton variant="bav" @click="submit">
        Submit for Approval
      </ActionButton>
    </template>
  </ModalShell>
</template>
