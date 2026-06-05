<script setup lang="ts">
import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import DoseBar from "@/components/DoseBar/DoseBar.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { SvgIcon } from "@/assets";
import { buildPatientDisplay } from "@/utils";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = withDefaults(
  defineProps<{
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    trial: Trial;
    showEligibility?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  }>(),
  { showEligibility: true, canEdit: true, canDelete: false },
);
defineEmits<{ detail: [id: string]; edit: [id: string]; remove: [id: string] }>();

function display(patient: Patient) {
  return buildPatientDisplay(patient, props.enrollments[patient.id], props.trial, "jh-doctor");
}
</script>

<template>
  <DataCard title="Patient Roster">
    <template #header>
      <StatusBadge tone="green">Full PII</StatusBadge>
    </template>
    <DataTable class="max-[520px]:hidden">
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
          class="cursor-pointer hover:bg-bg"
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
          <td class="flex min-w-[160px] flex-wrap gap-1.5 max-[640px]:min-w-[140px]" @click.stop>
            <ActionButton class="w-auto min-w-[68px] max-[420px]:w-auto" @click="$emit('detail', patient.id)">View</ActionButton>
            <ActionButton
              v-if="canEdit"
              class="w-auto min-w-[68px] max-[420px]:w-auto"
              variant="jh"
              @click="$emit('edit', patient.id)"
            >
              Edit
            </ActionButton>
            <ActionButton
              v-if="canDelete"
              class="w-auto min-w-[90px] max-[420px]:w-auto"
              variant="danger"
              @click="$emit('remove', patient.id)"
            >
              <SvgIcon name="trash" />
              Delete
            </ActionButton>
          </td>
        </tr>
      </tbody>
    </DataTable>
    <div class="hidden gap-3 p-3 max-[520px]:grid">
      <article
        v-for="patient in patients"
        :key="patient.id"
        class="rounded-md border border-rule bg-surface p-3 text-left shadow-sm"
      >
        <div class="mb-2 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <strong class="block break-words text-[15px] text-ink">{{ display(patient).name }}</strong>
            <div class="font-mono text-xs text-fda">{{ patient.id }}</div>
          </div>
          <StatusBadge v-if="showEligibility" :tone="enrollments[patient.id]?.eligible ? 'green' : 'gray'">
            {{ display(patient).eligibilityLabel }}
          </StatusBadge>
        </div>
        <div class="grid gap-2 text-[13px] text-muted">
          <div>
            <span class="font-mono text-[10px] uppercase tracking-[.12em]">DOB</span>
            <div class="text-ink">{{ display(patient).dob }}</div>
          </div>
          <div>
            <span class="font-mono text-[10px] uppercase tracking-[.12em]">ICD-10</span>
            <div class="text-ink">{{ display(patient).icdCodes }}</div>
          </div>
          <div>
            <span class="font-mono text-[10px] uppercase tracking-[.12em]">Doses</span>
            <DoseBar
              :doses="enrollments[patient.id]?.doses ?? 0"
              :total="trial.dosesPerPatient"
            />
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2" @click.stop>
          <ActionButton @click="$emit('detail', patient.id)">View</ActionButton>
          <ActionButton
            v-if="canEdit"
            variant="jh"
            @click="$emit('edit', patient.id)"
          >
            Edit
          </ActionButton>
          <ActionButton
            v-if="canDelete"
            class="col-span-2"
            variant="danger"
            @click="$emit('remove', patient.id)"
          >
            <SvgIcon name="trash" />
            Delete
          </ActionButton>
        </div>
      </article>
    </div>
  </DataCard>
</template>
