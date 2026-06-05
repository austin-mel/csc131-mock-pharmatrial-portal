<script setup lang="ts">
import {
    DataCard,
    TrialAppointmentsTab,
    TrialAssignmentsTab,
    TrialBatchTab,
    TrialDisclosureTab,
    TrialDoseTrackerTab,
    TrialNotifyFdaTab,
    TrialOverviewTab,
    TrialPatientsTab,
    TrialReportTab,
} from "@/components";
import type {
    Patient,
    Trial,
    TrialAssignmentMap,
    TrialEnrollmentMap,
    TrialTab,
} from "@/types";

defineProps<{
    activeTab: TrialTab;
    trial: Trial;
    trialPatients: Patient[];
    visibleTreatmentPatients: Patient[];
    eligiblePatients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
    allDosed: boolean;
    placeholderTitles: Record<TrialTab, string>;
}>();

defineEmits<{ remove: [id: string] }>();
</script>

<template>
    <TrialOverviewTab
        v-if="activeTab === 'overview'"
        :trial="trial"
        :patients="trialPatients"
        :enrollments="enrollments"
        :all-dosed="allDosed"
    />
    <TrialPatientsTab
        v-else-if="activeTab === 'patients'"
        :trial="trial"
        :patients="visibleTreatmentPatients"
        :enrollments="enrollments"
        :assignments="assignments"
        @remove="$emit('remove', $event)"
    />
    <TrialAppointmentsTab
        v-else-if="activeTab === 'appointments'"
        :trial="trial"
        :patients="trialPatients"
        :enrollments="enrollments"
    />
    <TrialDoseTrackerTab
        v-else-if="activeTab === 'doses'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
    />
    <TrialNotifyFdaTab
        v-else-if="activeTab === 'notify'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
        :assignments="assignments"
    />
    <TrialBatchTab
        v-else-if="activeTab === 'batch'"
        :trial="trial"
        :eligible-count="eligiblePatients.length"
    />
    <TrialAssignmentsTab
        v-else-if="activeTab === 'assignments'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
        :assignments="assignments"
    />
    <TrialDisclosureTab
        v-else-if="activeTab === 'disclose'"
        :trial="trial"
        :patients="eligiblePatients"
        :enrollments="enrollments"
        :assignments="assignments"
    />
    <TrialReportTab
        v-else-if="activeTab === 'report'"
        :trial="trial"
        :patients="trialPatients"
        :enrollments="enrollments"
        :assignments="assignments"
    />
    <DataCard v-else :title="placeholderTitles[activeTab]">
        <div class="px-[18px] py-5 text-sm text-muted">
            {{ placeholderTitles[activeTab] }}
        </div>
    </DataCard>
</template>
