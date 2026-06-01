<script setup lang="ts">
import { computed, watch } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import AppointmentFormModal from "@/components/Modals/Appointments/AppointmentFormModal.vue";
import DrugBatchModal from "@/components/Modals/Batches/DrugBatchModal.vue";
import ApprovalModal from "@/components/Modals/Regulatory/ApprovalModal.vue";
import DiscloseTrialModal from "@/components/Modals/Regulatory/DiscloseTrialModal.vue";
import FdaAssignmentModal from "@/components/Modals/Regulatory/FdaAssignmentModal.vue";
import NotifyFdaModal from "@/components/Modals/Regulatory/NotifyFdaModal.vue";
import PatientCsvUploadModal from "@/components/Modals/Patients/PatientCsvUploadModal.vue";
import PatientDetailModal from "@/components/Modals/Patients/PatientDetailModal.vue";
import PatientFormModal from "@/components/Modals/Patients/PatientFormModal.vue";
import RejectedTrialBanner from "@/components/Trials/RejectedTrialBanner.vue";
import TrialAppointmentsTab from "@/components/Trials/TrialAppointmentsTab.vue";
import TrialHeader from "@/components/Trials/TrialHeader.vue";
import TrialAssignmentsTab from "@/components/Trials/TrialAssignmentsTab.vue";
import TrialBatchTab from "@/components/Trials/TrialBatchTab.vue";
import TrialDisclosureTab from "@/components/Trials/TrialDisclosureTab.vue";
import TrialDoseTrackerTab from "@/components/Trials/TrialDoseTrackerTab.vue";
import TrialNotifyFdaTab from "@/components/Trials/TrialNotifyFdaTab.vue";
import TrialOverviewTab from "@/components/Trials/TrialOverviewTab.vue";
import TrialPatientsTab from "@/components/Trials/TrialPatientsTab.vue";
import TrialTabBar from "@/components/Trials/TrialTabBar.vue";
import { allEligibleDosed, completedDoseCount, eligiblePatients, getVisibleTabs, needsWorkflowReviewTag, trialPatients } from "@/composables";
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
const eligibleTrialPatients = computed(() => eligiblePatients(patientsStore.patients, enrollments.value));
const completedCount = computed(() =>
  trial.value ? completedDoseCount(trial.value, patientsStore.patients, enrollments.value) : 0,
);
const allDosed = computed(() =>
  trial.value ? allEligibleDosed(trial.value, patientsStore.patients, enrollments.value) : false,
);
const trialNeedsReview = computed(() =>
  trial.value ? needsWorkflowReviewTag(trial.value, auth.selectedPortalId, allDosed.value) : false,
);
const selectedPatient = computed(() => (ui.selectedPatientId ? patientsStore.getPatient(ui.selectedPatientId) : null));
const canEditPatients = computed(() => trial.value?.status !== "complete" && auth.selectedPortalId === "jh-doctor");
const canArchive = computed(() => Boolean(trial.value));

const placeholderTitles: Record<TrialTab, string> = {
  overview: "Overview",
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
    <TrialHeader
      :trial="trial"
      :eligible-count="eligibleTrialPatients.length"
      :completed-count="completedCount"
      :needs-review="trialNeedsReview"
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
        :all-dosed="allDosed"
      />
      <TrialPatientsTab
        v-else-if="ui.activeTab === 'patients'"
        :trial="trial"
        :patients="trialPatientsList"
        :enrollments="enrollments"
        :assignments="assignments"
      />
      <TrialAppointmentsTab
        v-else-if="ui.activeTab === 'appointments'"
        :trial="trial"
        :patients="trialPatientsList"
        :enrollments="enrollments"
      />
      <TrialDoseTrackerTab
        v-else-if="ui.activeTab === 'doses'"
        :trial="trial"
        :patients="eligibleTrialPatients"
        :enrollments="enrollments"
      />
      <TrialNotifyFdaTab
        v-else-if="ui.activeTab === 'notify'"
        :trial="trial"
        :patients="eligibleTrialPatients"
        :enrollments="enrollments"
      />
      <TrialBatchTab
        v-else-if="ui.activeTab === 'batch'"
        :trial="trial"
        :eligible-count="eligibleTrialPatients.length"
      />
      <TrialAssignmentsTab
        v-else-if="ui.activeTab === 'assignments'"
        :trial="trial"
        :patients="eligibleTrialPatients"
        :enrollments="enrollments"
        :assignments="assignments"
      />
      <TrialDisclosureTab
        v-else-if="ui.activeTab === 'disclose'"
        :trial="trial"
        :patients="eligibleTrialPatients"
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
    <AppointmentFormModal
      :open="ui.openModal === 'appointment-form'"
      :trial="trial"
      :patients="eligibleTrialPatients"
      :enrollments="enrollments"
      @close="ui.closeModal"
    />
    <ApprovalModal
      :open="ui.openModal === 'approval'"
      :trial="trial"
      @close="ui.closeModal"
    />
    <DrugBatchModal
      :open="ui.openModal === 'drug-batch'"
      :trial="trial"
      :eligible-count="eligibleTrialPatients.length"
      @close="ui.closeModal"
    />
    <FdaAssignmentModal
      :open="ui.openModal === 'fda-assignment'"
      :trial="trial"
      :patients="eligibleTrialPatients"
      :enrollments="enrollments"
      :assignments="assignments"
      @close="ui.closeModal"
    />
    <NotifyFdaModal
      :open="ui.openModal === 'notify-fda'"
      :trial="trial"
      :all-dosed="allDosed"
      @close="ui.closeModal"
    />
    <DiscloseTrialModal
      :open="ui.openModal === 'disclose-trial'"
      :trial="trial"
      :all-dosed="allDosed"
      @close="ui.closeModal"
    />
  </div>
</template>
