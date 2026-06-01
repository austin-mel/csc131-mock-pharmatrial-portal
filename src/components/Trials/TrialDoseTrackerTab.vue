<script setup lang="ts">
import { computed, ref, watch } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import ProgressBar from "@/components/Dashboard/ProgressBar.vue";
import PaginationControls from "@/components/Navigation/PaginationControls.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { SvgIcon } from "@/assets";
import { completedDoseCount, totalDosesGiven } from "@/composables";
import { useAuthStore } from "@/stores";
import { buildPatientDisplay, canShowPatientPii } from "@/utils";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  trial: Trial;
  patients: Patient[];
  enrollments: TrialEnrollmentMap;
}>();

const auth = useAuthStore();
const PAGE_SIZE = 20;
const page = ref(1);
const query = ref("");

const pii = computed(() => canShowPatientPii(auth.selectedPortalId));
const completedCount = computed(() => completedDoseCount(props.trial, props.patients, props.enrollments));
const totalDoses = computed(() => totalDosesGiven(props.patients, props.enrollments));
const requiredDoses = computed(() => props.patients.length * props.trial.dosesPerPatient);
const remainingDoses = computed(() => Math.max(0, requiredDoses.value - totalDoses.value));
const completionPct = computed(() =>
  requiredDoses.value ? Math.round((totalDoses.value / requiredDoses.value) * 100) : 0,
);
const filteredPatients = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.patients;
  return props.patients.filter((patient) =>
    [patient.name, patient.id].some((value) => value.toLowerCase().includes(q)),
  );
});
const pageCount = computed(() => Math.max(1, Math.ceil(filteredPatients.value.length / PAGE_SIZE)));
const pagedPatients = computed(() => filteredPatients.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));

watch([() => props.patients, query], () => {
  page.value = 1;
});

function changePage(delta: number) {
  page.value = Math.min(pageCount.value, Math.max(1, page.value + delta));
}

function patientDoses(patientId: string) {
  return props.enrollments[patientId]?.doses ?? 0;
}

function patientDisplay(patient: Patient) {
  return buildPatientDisplay(patient, props.enrollments[patient.id], props.trial, auth.selectedPortalId);
}
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
      <div>
        <div class="font-serif text-2xl font-normal">Dose Tracker</div>
        <div class="mt-0.5 text-[13px] text-muted">
          Per-patient dose progress for {{ trial.name }}. {{ pii ? "Includes Jane Hopkins patient identifiers." : "No PII." }}
        </div>
      </div>
      <div class="flex w-full justify-center md:w-auto md:justify-end">
        <input
          v-model="query"
          class="w-full min-w-0 max-w-[340px] rounded-[5px] border-[1.5px] border-rule bg-[#faf9f7] px-4 py-3 text-center text-[15px] md:w-[280px] md:text-left"
          placeholder="Search patients..."
        />
      </div>
    </div>
    <DataCard title="Overall Progress">
      <template #header>
        <span class="font-mono text-xs text-fda">{{ completedCount }}/{{ patients.length }} patients complete</span>
      </template>
      <div class="px-[18px] py-4">
        <ProgressBar :value="completionPct" />
        <div class="mt-2 flex justify-between gap-3 text-xs text-muted">
          <span>{{ totalDoses }} doses administered</span>
          <span>{{ remainingDoses }} remaining</span>
        </div>
      </div>
    </DataCard>
    <DataCard title="Per-Patient Dose Status">
      <template #header>
        <StatusBadge :tone="pii ? 'green' : 'blue'">{{ pii ? "Full PII" : "Anonymized" }}</StatusBadge>
      </template>
      <DataTable>
        <thead>
          <tr>
            <th v-if="pii">Patient</th>
            <th v-if="pii">DOB</th>
            <th>UUID</th>
            <th v-for="index in trial.dosesPerPatient" :key="index">D{{ index }}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!pagedPatients.length">
            <td :colspan="pii ? trial.dosesPerPatient + 4 : trial.dosesPerPatient + 2" class="text-muted">
              No eligible patients found.
            </td>
          </tr>
          <tr v-for="patient in pagedPatients" :key="patient.id">
            <td v-if="pii">{{ patientDisplay(patient).name }}</td>
            <td v-if="pii">{{ patientDisplay(patient).dob }}</td>
            <td class="font-mono text-xs text-fda">{{ patient.id }}</td>
            <td v-for="index in trial.dosesPerPatient" :key="index">
              <StatusBadge :tone="index <= patientDoses(patient.id) ? 'green' : 'gray'">
                <SvgIcon v-if="index <= patientDoses(patient.id)" name="check" />
                <span v-else>-</span>
              </StatusBadge>
            </td>
            <td>
              <StatusBadge :tone="patientDoses(patient.id) >= trial.dosesPerPatient ? 'green' : 'yellow'">
                {{ patientDoses(patient.id) >= trial.dosesPerPatient ? "Complete" : `${patientDoses(patient.id)}/${trial.dosesPerPatient}` }}
              </StatusBadge>
            </td>
          </tr>
        </tbody>
      </DataTable>
    </DataCard>
    <div v-if="pageCount > 1" class="mt-3">
      <PaginationControls :page="page" :pages="pageCount" @change="changePage" />
    </div>
  </div>
</template>
