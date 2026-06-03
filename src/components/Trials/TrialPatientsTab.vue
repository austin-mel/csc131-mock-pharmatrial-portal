<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import PatientAnonymizedTable from "@/components/PatientTables/PatientAnonymizedTable.vue";
import PatientTable from "@/components/PatientTables/PatientTable.vue";
import PaginationControls from "@/components/Navigation/PaginationControls.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import { SvgIcon } from "@/assets";
import { canAddPatients } from "@/composables";
import { useAuthStore, useUiStore } from "@/stores";
import { canShowPatientPii } from "@/utils";
import type { Patient, Trial, TrialAssignmentMap, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  trial: Trial;
  patients: Patient[];
  enrollments: TrialEnrollmentMap;
  assignments: TrialAssignmentMap;
}>();
defineEmits<{ remove: [id: string] }>();

const auth = useAuthStore();
const ui = useUiStore();
const query = ref("");
const page = ref(1);
const PAGE_SIZE = 20;

const pii = computed(() => canShowPatientPii(auth.selectedPortalId));
const canAdd = computed(() => canAddPatients(props.trial, auth.selectedPortalId));
const canCsv = computed(() => canAdd.value && (auth.selectedPortalId === "jh-admin" || auth.selectedPortalId === "jh-doctor"));
const canEditPatients = computed(() => pii.value && props.trial.status !== "complete");
const canDeletePatients = computed(() => auth.selectedPortalId === "jh-admin" && props.trial.status !== "complete");
const showEligibilityReview = computed(() => auth.selectedPortalId !== "jh-doctor");
const rows = computed(() => props.patients.filter((patient) => props.enrollments[patient.id]));
const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((patient) =>
    [patient.name, patient.id, patient.icdCodes.join(" ")].some((value) => value.toLowerCase().includes(q)),
  );
});
const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / PAGE_SIZE)));
const pagedRows = computed(() => filteredRows.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));
const eligibleCount = computed(() => rows.value.filter((patient) => props.enrollments[patient.id]?.eligible).length);
const completedCount = computed(() =>
  rows.value.filter(
    (patient) =>
      props.enrollments[patient.id]?.eligible &&
      (props.enrollments[patient.id]?.doses ?? 0) >= props.trial.dosesPerPatient,
  ).length,
);

watch([query, rows], () => {
  page.value = 1;
});

function changePage(delta: number) {
  page.value = Math.min(pageCount.value, Math.max(1, page.value + delta));
}
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
      <div>
        <div class="font-serif text-2xl font-normal">{{ pii ? "Patients" : "Patients (Anonymized)" }}</div>
        <div class="mt-0.5 text-[13px] text-muted">
          {{ pii ? "Full PII visible for Jane Hopkins doctor access." : "Patient UUIDs and clinical flags only. No PII at this access level." }}
        </div>
      </div>
      <div class="flex w-full flex-wrap items-center justify-center gap-2 md:w-auto md:justify-end">
        <input
          v-model="query"
          class="w-full min-w-0 max-w-[340px] rounded-[5px] border-[1.5px] border-rule bg-[#faf9f7] px-4 py-3 text-center text-[15px] md:w-[280px] md:text-left"
          placeholder="Search patients..."
        />
        <ActionButton v-if="canCsv" @click="ui.showModal('patient-csv')">
          <SvgIcon name="uploadFile" />
          Bulk Upload (CSV)
        </ActionButton>
        <ActionButton v-if="canAdd" variant="jh" @click="ui.showModal('patient-form')">
          <SvgIcon name="add" />
          Add Patient
        </ActionButton>
      </div>
    </div>
    <div v-if="!canAdd && pii" class="mb-5 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted">
      {{ trial.notifiedFDA ? "Patient roster is locked because results have been sent to the FDA." : "Patient enrollment is locked once a trial is active or completed." }}
    </div>
    <div class="mb-5 grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
      <StatCard label="Enrolled">{{ rows.length }}</StatCard>
      <StatCard :label="showEligibilityReview ? 'Eligible' : 'Treatment Patients'">{{ eligibleCount }}</StatCard>
      <StatCard label="Completed Doses">{{ completedCount }}</StatCard>
    </div>
    <PatientTable
      v-if="pii"
      :patients="pagedRows"
      :enrollments="enrollments"
      :trial="trial"
      :show-eligibility="showEligibilityReview"
      :can-edit="canEditPatients"
      :can-delete="canDeletePatients"
      @detail="ui.showModal('patient-detail', $event)"
      @edit="ui.showModal('patient-form', $event)"
      @remove="$emit('remove', $event)"
    />
    <PatientAnonymizedTable
      v-else
      :patients="pagedRows"
      :enrollments="enrollments"
      :trial="trial"
      :assignments="assignments"
      :show-tracking="auth.selectedPortalId === 'bavaria' || trial.disclosed"
      :show-clinical-data="auth.selectedPortalId === 'fda'"
      @detail="ui.showModal('patient-detail', $event)"
    />
    <div v-if="pageCount > 1" class="mt-3">
      <PaginationControls
        :page="page"
        :pages="pageCount"
        @change="changePage"
      />
    </div>
  </div>
</template>
