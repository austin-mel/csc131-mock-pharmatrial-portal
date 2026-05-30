<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { SvgIcon } from "@/assets";
import { checkEligibility } from "@/composables";
import { usePatientsStore, useTrialsStore, useUiStore } from "@/stores";
import type { Patient, Trial } from "@/types";
import type { CsvRow } from "@/utils";
import { parseCsvWithHeaders } from "@/utils";

interface PreviewRow {
  rowNum: number;
  data: CsvRow;
  patient: Patient | null;
  errors: string[];
  eligible: boolean;
}

const props = defineProps<{ open: boolean; trial: Trial }>();
const emit = defineEmits<{ close: [] }>();

const patients = usePatientsStore();
const trials = useTrialsStore();
const ui = useUiStore();
const rows = ref<PreviewRow[]>([]);
const fileName = ref("");

const validRows = computed(() => rows.value.filter((row) => !row.errors.length && row.patient));
const eligibleCount = computed(() => validRows.value.filter((row) => row.eligible).length);

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    rows.value = [];
    fileName.value = "";
  },
);

function valueFor(data: CsvRow, names: string[]) {
  const key = names.find((name) => data[name] !== undefined);
  return key ? data[key] : "";
}

function splitCodes(value: string) {
  return value.split(/[|;,]/).map((code) => code.trim()).filter(Boolean);
}

function generatePatientId() {
  const segment = () => Math.random().toString(36).slice(2, 6);
  let id = "";
  do {
    id = `${segment()}-${segment()}`;
  } while (patients.patients.some((patient) => patient.id === id));
  return id;
}

function makePatient(data: CsvRow): Patient {
  const existingId = valueFor(data, ["patientId", "id", "patient ID", "Patient ID"]);
  const firstName = valueFor(data, ["firstName", "first name", "First Name"]);
  const lastName = valueFor(data, ["lastName", "last name", "Last Name"]);
  const name = valueFor(data, ["name", "Name"]) || `${firstName} ${lastName}`.trim();
  const patientId = existingId || generatePatientId();
  const existing = patients.getPatient(patientId);
  const icdText = valueFor(data, ["icdCodes", "icd", "ICD", "ICD codes", "ICD-10", "icd10"]);

  return {
    id: patientId,
    name,
    dob: valueFor(data, ["dob", "DOB", "dateOfBirth", "date of birth"]) || existing?.dob || "",
    icdCodes: icdText ? splitCodes(icdText) : existing?.icdCodes ?? [],
    bloodType: valueFor(data, ["bloodType", "blood type", "Blood Type"]) || existing?.bloodType || "O+",
    meds: valueFor(data, ["meds", "medications", "Medications"]) || existing?.meds || "None",
    allergy: valueFor(data, ["allergy", "allergies", "Allergies"]) || existing?.allergy || "None",
    height: Number(valueFor(data, ["height", "heightCm", "height cm"])) || existing?.height,
    weight: Number(valueFor(data, ["weight", "weightKg", "weight kg"])) || existing?.weight,
    bp: valueFor(data, ["bp", "bloodPressure", "blood pressure"]) || existing?.bp,
    oxygen: Number(valueFor(data, ["oxygen", "o2", "O2"])) || existing?.oxygen,
    temperature: valueFor(data, ["temperature", "temp"]) || existing?.temperature,
    address: valueFor(data, ["address", "Address"]) || existing?.address,
    insuranceId: valueFor(data, ["insuranceId", "insurance ID", "insurance"]) || existing?.insuranceId,
    employment: valueFor(data, ["employment", "Employment"]) || existing?.employment || "Employed",
  };
}

function processText(text: string) {
  const parsed = parseCsvWithHeaders(text);
  if (!parsed.headers.length) {
    ui.pushToast("CSV file is empty.", "error");
    rows.value = [];
    return;
  }

  rows.value = parsed.rows.map((data, index) => {
    const patient = makePatient(data);
    const errors: string[] = [];
    if (!patient.id.trim()) errors.push("Patient ID missing");
    if (!patient.name.trim()) errors.push("Name missing");
    if (!patient.dob.trim()) errors.push("DOB missing");
    const eligible = errors.length ? false : checkEligibility(patient, props.trial);
    return { rowNum: index + 2, data, patient, errors, eligible };
  });
}

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = () => processText(String(reader.result ?? ""));
  reader.readAsText(file);
}

function downloadTemplate() {
  const csv = [
    "patientId,name,dob,icdCodes,bloodType,meds,allergy,height,weight,bp,oxygen,temperature,address,insuranceId,employment",
    "a3f9-2c11,Maria Johnson,1978-03-14,B20|Z21,O+,None,Penicillin,163,58,118/76,98,98.4F,1420 Elm St,INS-447821093,Employed",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "patient-upload-template.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importRows() {
  validRows.value.forEach((row) => {
    if (!row.patient) return;
    patients.upsertPatient(row.patient);
    trials.enrollPatient(props.trial.id, row.patient.id, checkEligibility(row.patient, props.trial));
  });
  ui.pushToast(`Imported ${validRows.value.length} patients (${eligibleCount.value} eligible).`, "success");
  emit("close");
}
</script>

<template>
  <ModalShell
    :open="open"
    title="Bulk Upload Patients (CSV)"
    wide
    @close="$emit('close')"
  >
    <p class="mb-4 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted">
      Upload creates or updates patients and enrolls valid rows in the active trial.
    </p>
    <div class="mb-1.5 mt-3.5 font-mono text-[10px] uppercase tracking-[.12em] text-muted">CSV Format</div>
    <p class="mb-2 text-xs text-muted">
      Supported columns: patientId, name, dob, icdCodes, bloodType, meds, allergy, height, weight, bp, oxygen, temperature.
    </p>
    <ActionButton @click="downloadTemplate">
      <SvgIcon name="uploadFile" />
      Download Template
    </ActionButton>
    <div class="mb-1.5 mt-3.5 font-mono text-[10px] uppercase tracking-[.12em] text-muted">Upload File</div>
    <input type="file" accept=".csv,text/csv" @change="handleFile" />
    <div v-if="fileName" class="mt-2 font-mono text-xs text-fda">{{ fileName }}</div>
    <template v-if="rows.length">
      <div class="my-4 grid grid-cols-3 gap-3">
        <StatCard label="Total Rows">{{ rows.length }}</StatCard>
        <StatCard label="Valid">{{ validRows.length }}</StatCard>
        <StatCard label="Eligible">{{ eligibleCount }}</StatCard>
      </div>
      <DataCard title="Preview">
        <DataTable>
          <thead>
            <tr>
              <th>Row</th>
              <th>Patient</th>
              <th>ICD-10</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.rowNum">
              <td class="font-mono text-xs text-fda">{{ row.rowNum }}</td>
              <td>
                <strong>{{ row.patient?.name || "-" }}</strong>
                <div class="font-mono text-xs text-fda">{{ row.patient?.id || "-" }}</div>
              </td>
              <td>{{ row.patient?.icdCodes.join(", ") || "-" }}</td>
              <td>
                <StatusBadge :tone="row.errors.length ? 'red' : row.eligible ? 'green' : 'gray'">
                  {{ row.errors.length ? row.errors.join(", ") : row.eligible ? "Eligible" : "Will be excluded" }}
                </StatusBadge>
              </td>
            </tr>
          </tbody>
        </DataTable>
      </DataCard>
    </template>
    <template #footer>
      <ActionButton @click="$emit('close')">Cancel</ActionButton>
      <ActionButton
        variant="jh"
        :disabled="!validRows.length"
        @click="importRows"
      >
        Import Patients
      </ActionButton>
    </template>
  </ModalShell>
</template>
