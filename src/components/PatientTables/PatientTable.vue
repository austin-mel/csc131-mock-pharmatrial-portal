<script setup lang="ts">
import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import DoseBar from "@/components/DoseBar/DoseBar.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { buildPatientDisplay } from "@/utils";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = withDefaults(
  defineProps<{
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    trial: Trial;
    showEligibility?: boolean;
    canEdit?: boolean;
  }>(),
  { showEligibility: true, canEdit: true },
);
defineEmits<{ detail: [id: string]; edit: [id: string] }>();

function display(patient: Patient) {
  return buildPatientDisplay(patient, props.enrollments[patient.id], props.trial, "jh-doctor");
}
</script>

<template>
  <DataCard title="Patient Roster">
    <template #header>
      <StatusBadge tone="green">Full PII</StatusBadge>
    </template>
    <DataTable>
      <thead>
        <tr>
          <th>Patient</th>
          <th class="hidden md:table-cell">DOB</th>
          <th class="hidden md:table-cell">ICD-10</th>
          <th v-if="showEligibility" class="hidden md:table-cell">Eligible</th>
          <th>Doses</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="patient in patients"
          :key="patient.id"
          class="cursor-pointer hover:bg-[#faf9f7]"
          @click="$emit('detail', patient.id)"
        >
          <td>
            <strong>{{ display(patient).name }}</strong>
            <div class="font-mono text-xs text-fda">{{ patient.id }}</div>
          </td>
          <td class="hidden md:table-cell">{{ display(patient).dob }}</td>
          <td class="hidden md:table-cell">{{ display(patient).icdCodes }}</td>
          <td v-if="showEligibility" class="hidden md:table-cell">
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
          <td class="flex flex-wrap gap-1.5" @click.stop>
            <ActionButton class="w-[74px]" @click="$emit('detail', patient.id)">View</ActionButton>
            <ActionButton
              v-if="canEdit"
              class="w-[74px]"
              variant="jh"
              @click="$emit('edit', patient.id)"
            >
              Edit
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </DataCard>
</template>
