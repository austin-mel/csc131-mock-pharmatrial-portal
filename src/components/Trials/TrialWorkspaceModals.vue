<script setup lang="ts">
import {
    AppointmentFormModal,
    ApprovalModal,
    DiscloseTrialModal,
    DrugBatchModal,
    FdaAssignmentModal,
    NotifyFdaModal,
    PatientCsvUploadModal,
    PatientDetailModal,
    PatientFormModal,
} from "@/components";
import type {
    ModalId,
    Patient,
    Trial,
    TrialAssignmentMap,
    TrialEnrollmentMap,
} from "@/types";

defineProps<{
    openModal: ModalId | null;
    selectedPatientId: string | null;
    selectedPatient: Patient | null;
    trial: Trial;
    eligiblePatients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
    allDosed: boolean;
}>();

defineEmits<{
    close: [];
    editPatient: [id: string];
    logAppointment: [id: string];
    removePatient: [id: string];
}>();
</script>

<template>
    <PatientDetailModal
        :open="openModal === 'patient-detail'"
        :patient="selectedPatient"
        :trial="trial"
        :enrollments="enrollments"
        @close="$emit('close')"
        @edit="$emit('editPatient', $event)"
        @log-appointment="$emit('logAppointment', $event)"
        @remove="$emit('removePatient', $event)"
    />
    <PatientFormModal
        :open="openModal === 'patient-form'"
        :patient="selectedPatient"
        :trial="trial"
        @close="$emit('close')"
    />
    <PatientCsvUploadModal
        :open="openModal === 'patient-csv'"
        :trial="trial"
        @close="$emit('close')"
    />
    <AppointmentFormModal
        :open="openModal === 'appointment-form'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
        :initial-patient-id="selectedPatientId"
        @close="$emit('close')"
    />
    <ApprovalModal
        :open="openModal === 'approval'"
        :trial="trial"
        @close="$emit('close')"
    />
    <DrugBatchModal
        :open="openModal === 'drug-batch'"
        :trial="trial"
        :eligible-count="eligiblePatients.length"
        @close="$emit('close')"
    />
    <FdaAssignmentModal
        :open="openModal === 'fda-assignment'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
        :assignments="assignments"
        @close="$emit('close')"
    />
    <NotifyFdaModal
        :open="openModal === 'notify-fda'"
        :trial="trial"
        :all-dosed="allDosed"
        @close="$emit('close')"
    />
    <DiscloseTrialModal
        :open="openModal === 'disclose-trial'"
        :trial="trial"
        :all-dosed="allDosed"
        @close="$emit('close')"
    />
</template>
