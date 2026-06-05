<script setup lang="ts">
import {
    RejectedTrialBanner,
    TrialHeader,
    TrialTabBar,
    TrialTabContent,
    TrialWorkspaceModals,
} from "@/components";
import { computed, watch } from "vue";

import {
    allEligibleDosed,
    canArchiveTrial,
    canDeleteArchivedTrial,
    completedDoseCount,
    eligiblePatients,
    getVisibleTabs,
    needsWorkflowReviewTag,
    trialPatients,
} from "@/composables";
import {
    useAuthStore,
    usePatientsStore,
    useTrialsStore,
    useUiStore,
} from "@/stores";
import type { TrialAssignmentMap, TrialEnrollmentMap, TrialTab } from "@/types";

const auth = useAuthStore();
const patientsStore = usePatientsStore();
const trials = useTrialsStore();
const ui = useUiStore();

const trial = computed(() => trials.currentTrial);
const tabs = computed<TrialTab[]>(() =>
    trial.value
        ? getVisibleTabs(trial.value, auth.selectedPortalId)
        : ["overview"],
);
const enrollments = computed<TrialEnrollmentMap>(() =>
    trial.value ? trials.enrollmentsFor(trial.value.id) : {},
);
const assignments = computed<TrialAssignmentMap>(() =>
    trial.value ? trials.assignmentsFor(trial.value.id) : {},
);
const trialPatientsList = computed(() =>
    trialPatients(patientsStore.patients, enrollments.value),
);
const eligibleTrialPatients = computed(() =>
    eligiblePatients(patientsStore.patients, enrollments.value),
);
const visibleTreatmentPatients = computed(() =>
    auth.selectedPortalId === "jh-doctor"
        ? eligibleTrialPatients.value
        : trialPatientsList.value,
);
const completedCount = computed(() =>
    trial.value
        ? completedDoseCount(
              trial.value,
              patientsStore.patients,
              enrollments.value,
          )
        : 0,
);
const allDosed = computed(() =>
    trial.value
        ? allEligibleDosed(
              trial.value,
              patientsStore.patients,
              enrollments.value,
          )
        : false,
);
const trialNeedsReview = computed(() =>
    trial.value
        ? needsWorkflowReviewTag(
              trial.value,
              auth.selectedPortalId,
              allDosed.value,
          )
        : false,
);
const selectedPatient = computed(() =>
    ui.selectedPatientId
        ? patientsStore.getPatient(ui.selectedPatientId)
        : null,
);
const canEditPatients = computed(
    () =>
        trial.value?.status !== "complete" &&
        auth.selectedPortalId === "jh-doctor",
);
const canArchive = computed(() =>
    trial.value ? canArchiveTrial(trial.value, auth.selectedPortalId) : false,
);
const canDelete = computed(() =>
    trial.value
        ? canDeleteArchivedTrial(trial.value, auth.selectedPortalId)
        : false,
);

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
    if (!trial.value || !canArchive.value) return;
    trials.toggleArchive(trial.value.id);
}

function deleteTrial() {
    if (!trial.value || !canDelete.value) return;
    const confirmed = window.confirm(
        `Delete ${trial.value.name}? This cannot be undone.`,
    );
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

function logPatientAppointment(id: string) {
    if (
        auth.selectedPortalId !== "jh-doctor" ||
        trial.value?.status === "complete"
    )
        return;
    ui.showModal("appointment-form", id);
}

function deletePatient(id: string) {
    if (
        auth.selectedPortalId !== "jh-admin" ||
        trial.value?.status === "complete"
    )
        return;
    const patient = patientsStore.getPatient(id);
    if (!patient) return;
    const confirmed = window.confirm(
        `Delete ${patient.name}? This will remove the patient from all trial records.`,
    );
    if (!confirmed) return;
    patientsStore.deletePatient(id);
    trials.removePatientReferences(id);
    ui.closeModal();
    ui.pushToast("Patient record deleted.", "success");
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
            :can-delete="canDelete"
            @archive="archive"
            @delete="deleteTrial"
        />
        <RejectedTrialBanner v-if="trial.status === 'rejected'" />
        <TrialTabBar
            :tabs="tabs"
            :active="ui.activeTab"
            @change="ui.switchTab"
        />
        <main class="p-7 max-[640px]:p-4">
            <TrialTabContent
                :active-tab="ui.activeTab"
                :trial="trial"
                :trial-patients="trialPatientsList"
                :visible-treatment-patients="visibleTreatmentPatients"
                :eligible-patients="eligibleTrialPatients"
                :enrollments="enrollments"
                :assignments="assignments"
                :all-dosed="allDosed"
                :placeholder-titles="placeholderTitles"
                @remove="deletePatient"
            />
        </main>
        <TrialWorkspaceModals
            :open-modal="ui.openModal"
            :selected-patient-id="ui.selectedPatientId"
            :selected-patient="selectedPatient"
            :trial="trial"
            :eligible-patients="eligibleTrialPatients"
            :enrollments="enrollments"
            :assignments="assignments"
            :all-dosed="allDosed"
            @close="ui.closeModal"
            @edit-patient="editPatient"
            @log-appointment="logPatientAppointment"
            @remove-patient="deletePatient"
        />
    </div>
</template>
