<script setup lang="ts">
import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import DoseBar from "@/components/DoseBar/DoseBar.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { buildAnonymizedPatientDisplay } from "@/utils";
import type { Patient, Trial, TrialAssignmentMap, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  patients: Patient[];
  enrollments: TrialEnrollmentMap;
  trial: Trial;
  assignments?: TrialAssignmentMap;
  showTracking?: boolean;
  showClinicalData?: boolean;
}>();
defineEmits<{ detail: [id: string] }>();

function statusLabel(patientId: string) {
  const patient = props.patients.find((row) => row.id === patientId);
  if (!patient) return "Excluded";
  return buildAnonymizedPatientDisplay(
    patient,
    props.enrollments[patientId],
    props.trial,
    props.assignments?.[patientId],
    props.showTracking,
  ).statusLabel;
}

function statusTone(patientId: string) {
  const enrollment = props.enrollments[patientId];
  if (!enrollment?.eligible) return "gray";
  return statusLabel(patientId) === "Complete" ? "green" : "yellow";
}

function display(patient: Patient) {
  return buildAnonymizedPatientDisplay(
    patient,
    props.enrollments[patient.id],
    props.trial,
    props.assignments?.[patient.id],
    props.showTracking,
  );
}
</script>

<template>
  <DataCard title="Patient Roster">
    <template #header>
      <StatusBadge tone="blue">Anonymized</StatusBadge>
    </template>
    <DataTable>
      <thead>
        <tr>
          <th>UUID</th>
          <th v-if="showClinicalData">ICD-10</th>
          <th>Eligibility</th>
          <th>Doses</th>
          <th>Status</th>
          <th v-if="showTracking">Tracking ID</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="patient in patients"
          :key="patient.id"
          class="cursor-pointer hover:bg-[#faf9f7]"
          @click="$emit('detail', patient.id)"
        >
          <td class="font-mono text-xs text-fda">{{ patient.id }}</td>
          <td v-if="showClinicalData">{{ display(patient).icdCodes }}</td>
          <td>
            <StatusBadge :tone="enrollments[patient.id]?.eligible ? 'green' : 'gray'">
              {{ display(patient).eligibilityLabel }}
            </StatusBadge>
          </td>
          <td>
            <DoseBar
              :doses="enrollments[patient.id]?.doses ?? 0"
              :total="trial.dosesPerPatient"
            />
          </td>
          <td>
            <StatusBadge :tone="statusTone(patient.id)">
              {{ statusLabel(patient.id) }}
            </StatusBadge>
          </td>
          <td v-if="showTracking" class="font-mono text-xs text-fda">
            {{ trial.disclosed ? display(patient).trackingId : "-" }}
          </td>
        </tr>
      </tbody>
    </DataTable>
  </DataCard>
</template>
