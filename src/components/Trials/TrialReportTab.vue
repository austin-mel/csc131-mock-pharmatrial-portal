<script setup lang="ts">
import {
    DataCard,
    StatCard,
    StatusBadge,
    TrialReportAdverseEventsTable,
    TrialReportComparisonTable,
    TrialReportOutcomeTable,
} from "@/components";
import { computed } from "vue";

import {
    averageReduction,
    buildReportRows,
    formatReduction,
    totalAdverseEvents,
} from "@/composables";
import { buildReportRowDisplay } from "@/utils";
import { useAuthStore } from "@/stores";
import type {
    Patient,
    Trial,
    TrialAssignmentMap,
    TrialEnrollmentMap,
} from "@/types";

const props = defineProps<{
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    assignments: TrialAssignmentMap;
}>();

const auth = useAuthStore();
const rows = computed(() =>
    buildReportRows(props.patients, props.enrollments, props.assignments),
);
const displayRows = computed(() =>
    rows.value.map((row) =>
        buildReportRowDisplay(
            row,
            props.patients.find((patient) => patient.id === row.patientId),
            auth.selectedPortalId,
        ),
    ),
);
const treatmentRows = computed(() =>
    rows.value.filter((row) => row.group === "treatment"),
);
const placeboRows = computed(() =>
    rows.value.filter((row) => row.group === "placebo"),
);
const treatmentAverage = computed(() =>
    averageReduction(rows.value, "treatment"),
);
const placeboAverage = computed(() => averageReduction(rows.value, "placebo"));
const adverseEventRows = computed(() =>
    displayRows.value.filter((row) => row.adverseEventCount > 0),
);
const treatmentAdverseEvents = computed(() =>
    treatmentRows.value.reduce((sum, row) => sum + row.adverseEvents.length, 0),
);
const placeboAdverseEvents = computed(() =>
    placeboRows.value.reduce((sum, row) => sum + row.adverseEvents.length, 0),
);
</script>

<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
                <div class="font-serif text-2xl font-normal">Trial Report</div>
                <div class="mt-0.5 text-[13px] text-muted">
                    Final outcome rows, adverse events, and treatment/placebo
                    comparison.
                </div>
            </div>
            <StatusBadge :tone="trial.disclosed ? 'green' : 'yellow'">
                {{ trial.disclosed ? "Disclosed" : "Locked" }}
            </StatusBadge>
        </div>

        <template v-if="!trial.disclosed">
            <div
                class="mb-5 rounded-md border border-[#f0d8a8] bg-[#fff8e8] px-4 py-3 text-sm text-[#8a5b00]"
            >
                Report data is locked until the FDA sends the final report and
                discloses treatment assignments.
            </div>
            <DataCard title="Awaiting FDA Report">
                <div class="p-[18px] text-sm text-muted">
                    Once the report is released, authorized roles can compare
                    treatment and placebo outcomes here.
                </div>
            </DataCard>
        </template>

        <template v-else>
            <div
                class="mb-5 grid grid-cols-3 gap-3 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1"
            >
                <StatCard label="Report Rows">{{ rows.length }}</StatCard>
                <StatCard label="Treatment Group">{{
                    treatmentRows.length
                }}</StatCard>
                <StatCard label="Placebo Group">{{
                    placeboRows.length
                }}</StatCard>
                <StatCard label="Avg Treatment Reduction">{{
                    formatReduction(treatmentAverage)
                }}</StatCard>
                <StatCard label="Avg Placebo Reduction">{{
                    formatReduction(placeboAverage)
                }}</StatCard>
                <StatCard label="Adverse Events">{{
                    totalAdverseEvents(rows)
                }}</StatCard>
            </div>

            <TrialReportComparisonTable
                :treatment-count="treatmentRows.length"
                :placebo-count="placeboRows.length"
                :treatment-average="formatReduction(treatmentAverage)"
                :placebo-average="formatReduction(placeboAverage)"
                :treatment-adverse-events="treatmentAdverseEvents"
                :placebo-adverse-events="placeboAdverseEvents"
            />
            <TrialReportOutcomeTable :rows="displayRows" />
            <TrialReportAdverseEventsTable :rows="adverseEventRows" />
        </template>
    </div>
</template>
