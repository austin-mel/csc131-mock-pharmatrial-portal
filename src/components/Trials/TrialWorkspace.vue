<script setup lang="ts">
import { computed, watch } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import PatientCsvUploadModal from "@/components/Modals/Patients/PatientCsvUploadModal.vue";
import PatientDetailModal from "@/components/Modals/Patients/PatientDetailModal.vue";
import PatientFormModal from "@/components/Modals/Patients/PatientFormModal.vue";
import RejectedTrialBanner from "@/components/Trials/RejectedTrialBanner.vue";
import TrialBanner from "@/components/Trials/TrialBanner.vue";
import TrialOverviewTab from "@/components/Trials/TrialOverviewTab.vue";
import TrialPatientsTab from "@/components/Trials/TrialPatientsTab.vue";
import TrialTabBar from "@/components/Trials/TrialTabBar.vue";
import { getVisibleTabs, trialPatients } from "@/composables";
import { useAuthStore, usePatientsStore, useTrialsStore, useUiStore } from "@/stores";
import type { TrialAssignmentMap, TrialEnrollmentMap, TrialTab } from "@/types";

const auth = useAuthStore();
const patientsStore = usePatientsStore();
const trials = useTrialsStore();
const ui = useUiStore();

const trial = computed(() => trials.currentTrial);
const tabs = computed<TrialTab[]>(() =>
  trial.value ? getVisibleTabs(trial.value, auth.selectedPortalId) : ["overview"],
);
const enrollments = computed<TrialEnrollmentMap>(() => (trial.value ? trials.enrollmentsFor(trial.value.id) : {}));
const assignments = computed<TrialAssignmentMap>(() => (trial.value ? trials.assignmentsFor(trial.value.id) : {}));
const trialPatientsList = computed(() => trialPatients(patientsStore.patients, enrollments.value));
const selectedPatient = computed(() => (ui.selectedPatientId ? patientsStore.getPatient(ui.selectedPatientId) : null));
const canEditPatients = computed(() => trial.value?.status !== "complete" && auth.selectedPortalId === "jh-doctor");
const canArchive = computed(() => Boolean(trial.value));

const placeholderTitles: Record<Exclude<TrialTab, "overview">, string> = {
  patients: "Patients",
  appointments: "Appointments",
  doses: "Dose Tracker",
  notify: "Notify FDA",
  assignments: "Assignments",
  disclose: "Disclose",
  batch: "Drug Batch",
  report: "Report",
};

watch(
  tabs,
  (visibleTabs) => {
    if (!visibleTabs.includes(ui.activeTab)) ui.switchTab("overview");
  },
  { immediate: true },
);

function archive() {
  if (!trial.value) return;
  trials.toggleArchive(trial.value.id);
}

function deleteTrial() {
  if (!trial.value) return;
  const confirmed = window.confirm(`Delete ${trial.value.name}? This cannot be undone.`);
  if (!confirmed) return;
  trials.deleteTrial(trial.value.id);
}

function showPatientForm(id: string | null = null) {
  ui.showModal("patient-form", id);
}

function editPatient(id: string) {
  if (!canEditPatients.value) return;
  showPatientForm(id);
}
</script>

<template>
  <div v-if="trial" class="flex min-h-0 flex-1 flex-col">
    <TrialBanner
      :trial="trial"
      :can-archive="canArchive"
      @archive="archive"
      @delete="deleteTrial"
    />
    <RejectedTrialBanner
      v-if="trial.status === 'rejected'"
    />
    <TrialTabBar
      :tabs="tabs"
      :active="ui.activeTab"
      @change="ui.switchTab"
    />
    <main class="p-7 max-[640px]:p-4">
      <TrialOverviewTab
        v-if="ui.activeTab === 'overview'"
        :trial="trial"
      />
      <TrialPatientsTab
        v-else-if="ui.activeTab === 'patients'"
        :trial="trial"
        :patients="trialPatientsList"
        :enrollments="enrollments"
        :assignments="assignments"
      />
      <DataCard
        v-else
        :title="placeholderTitles[ui.activeTab]"
      >
        <div class="px-[18px] py-5 text-sm text-muted">
          {{ placeholderTitles[ui.activeTab] }}
        </div>
      </DataCard>
    </main>
    <PatientDetailModal
      :open="ui.openModal === 'patient-detail'"
      :patient="selectedPatient"
      :trial="trial"
      :enrollments="enrollments"
      @close="ui.closeModal"
      @edit="editPatient"
    />
    <PatientFormModal
      :open="ui.openModal === 'patient-form'"
      :patient="selectedPatient"
      :trial="trial"
      @close="ui.closeModal"
    />
    <PatientCsvUploadModal
      :open="ui.openModal === 'patient-csv'"
      :trial="trial"
      @close="ui.closeModal"
    />
  </div>
</template>
