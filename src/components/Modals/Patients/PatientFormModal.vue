<script setup lang="ts">
import { ref, watch } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import FormField from "@/components/Form/FormField.vue";
import FormInput from "@/components/Form/FormInput.vue";
import FormRow from "@/components/Form/FormRow.vue";
import FormSelect from "@/components/Form/FormSelect.vue";
import FormTextarea from "@/components/Form/FormTextarea.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import { checkEligibility } from "@/composables";
import { usePatientsStore, useTrialsStore, useUiStore } from "@/stores";
import type { Patient, Trial } from "@/types";

const props = defineProps<{ open: boolean; patient: Patient | null; trial: Trial }>();
const emit = defineEmits<{ close: [] }>();

const patients = usePatientsStore();
const trials = useTrialsStore();
const ui = useUiStore();

const firstName = ref("");
const lastName = ref("");
const dob = ref("");
const bloodType = ref("O+");
const icdCodes = ref("");
const bp = ref("");
const oxygen = ref<number | null>(null);
const meds = ref("");
const allergy = ref("");
const height = ref<number | null>(null);
const weight = ref<number | null>(null);
const address = ref("");
const insuranceId = ref("");
const employment = ref("Employed");
const temperature = ref("");

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const name = props.patient?.name.split(" ") ?? ["", ""];
    firstName.value = name[0] ?? "";
    lastName.value = name.slice(1).join(" ");
    dob.value = props.patient?.dob ?? "";
    bloodType.value = props.patient?.bloodType ?? "O+";
    icdCodes.value = props.patient?.icdCodes.join(", ") ?? "";
    bp.value = props.patient?.bp ?? "";
    oxygen.value = props.patient?.oxygen ?? null;
    meds.value = props.patient?.meds ?? "";
    allergy.value = props.patient?.allergy ?? "";
    height.value = props.patient?.height ?? null;
    weight.value = props.patient?.weight ?? null;
    address.value = props.patient?.address ?? "";
    insuranceId.value = props.patient?.insuranceId ?? "";
    employment.value = props.patient?.employment ?? "Employed";
    temperature.value = props.patient?.temperature ?? "";
  },
);

function generatePatientId() {
  const segment = () => Math.random().toString(36).slice(2, 6);
  let id = "";
  do {
    id = `${segment()}-${segment()}`;
  } while (patients.patients.some((patient) => patient.id === id));
  return id;
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function save() {
  if (!firstName.value.trim() || !lastName.value.trim()) {
    ui.pushToast("Patient first and last name are required.", "error");
    return;
  }

  const patient: Patient = {
    id: props.patient?.id ?? generatePatientId(),
    name: `${firstName.value.trim()} ${lastName.value.trim()}`,
    dob: dob.value,
    bloodType: bloodType.value,
    icdCodes: splitList(icdCodes.value),
    bp: bp.value,
    oxygen: Number(oxygen.value) || undefined,
    meds: meds.value || "None",
    allergy: allergy.value || "None",
    height: Number(height.value) || undefined,
    weight: Number(weight.value) || undefined,
    address: address.value,
    insuranceId: insuranceId.value,
    employment: employment.value,
    temperature: temperature.value,
  };

  patients.upsertPatient(patient);
  trials.enrollPatient(props.trial.id, patient.id, checkEligibility(patient, props.trial));
  ui.pushToast(props.patient ? "Patient record updated." : "Patient added and enrolled.", "success");
  emit("close");
}
</script>

<template>
  <ModalShell
    :open="open"
    :title="patient ? 'Edit Patient Record' : 'Add New Patient & Enroll in Trial'"
    wide
    @close="$emit('close')"
  >
    <div class="mb-2 mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-muted">Demographics</div>
    <FormRow>
      <FormField label="First Name"><FormInput v-model="firstName" /></FormField>
      <FormField label="Last Name"><FormInput v-model="lastName" /></FormField>
    </FormRow>
    <FormRow>
      <FormField label="Date of Birth"><FormInput v-model="dob" type="date" /></FormField>
      <FormField label="Blood Type">
        <FormSelect v-model="bloodType">
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </FormSelect>
      </FormField>
    </FormRow>
    <FormField label="Address"><FormInput v-model="address" /></FormField>
    <FormRow>
      <FormField label="Insurance ID"><FormInput v-model="insuranceId" /></FormField>
      <FormField label="Employment">
        <FormSelect v-model="employment">
          <option>Employed</option>
          <option>Unemployed</option>
          <option>Retired</option>
          <option>Student</option>
          <option>Self-employed</option>
        </FormSelect>
      </FormField>
    </FormRow>
    <div class="mb-2 mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-muted">Clinical Data</div>
    <FormField label="ICD-10 Codes"><FormInput v-model="icdCodes" placeholder="B20, Z21" /></FormField>
    <FormRow>
      <FormField label="Height (cm)"><FormInput v-model="height" type="number" /></FormField>
      <FormField label="Weight (kg)"><FormInput v-model="weight" type="number" /></FormField>
    </FormRow>
    <FormRow>
      <FormField label="Blood Pressure"><FormInput v-model="bp" placeholder="118/76" /></FormField>
      <FormField label="O2 Saturation (%)"><FormInput v-model="oxygen" type="number" /></FormField>
    </FormRow>
    <FormField label="Temperature"><FormInput v-model="temperature" placeholder="98.6F" /></FormField>
    <FormField label="Current Medications"><FormTextarea v-model="meds" /></FormField>
    <FormField label="Allergies"><FormTextarea v-model="allergy" /></FormField>
    <template #footer>
      <ActionButton @click="$emit('close')">Cancel</ActionButton>
      <ActionButton variant="jh" @click="save">Save Patient</ActionButton>
    </template>
  </ModalShell>
</template>
