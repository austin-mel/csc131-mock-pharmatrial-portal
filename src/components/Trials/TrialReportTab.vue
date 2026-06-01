<script setup lang="ts">
import { computed } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import DataTable from "@/components/Dashboard/DataTable.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { averageReduction, buildReportRows, formatReduction, totalAdverseEvents } from "@/composables";
import { buildReportRowDisplay } from "@/utils";
import { useAuthStore } from "@/stores";
import type { Patient, Trial, TrialAssignmentMap, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  trial: Trial;
  patients: Patient[];
  enrollments: TrialEnrollmentMap;
  assignments: TrialAssignmentMap;
}>();

const auth = useAuthStore();
const rows = computed(() => buildReportRows(props.patients, props.enrollments, props.assignments));
const displayRows = computed(() =>
  rows.value.map((row) =>
    buildReportRowDisplay(
      row,
      props.patients.find((patient) => patient.id === row.patientId),
      auth.selectedPortalId,
    ),
  ),
);
const treatmentRows = computed(() => rows.value.filter((row) => row.group === "treatment"));
const placeboRows = computed(() => rows.value.filter((row) => row.group === "placebo"));
const treatmentAverage = computed(() => averageReduction(rows.value, "treatment"));
const placeboAverage = computed(() => averageReduction(rows.value, "placebo"));
const adverseEventRows = computed(() => displayRows.value.filter((row) => row.adverseEventCount > 0));
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
          Final outcome rows, adverse events, and treatment/placebo comparison.
        </div>
      </div>
      <StatusBadge :tone="trial.disclosed ? 'green' : 'yellow'">
        {{ trial.disclosed ? "Disclosed" : "Locked" }}
      </StatusBadge>
    </div>

    <template v-if="!trial.disclosed">
      <div class="mb-5 rounded-md border border-[#f0d8a8] bg-[#fff8e8] px-4 py-3 text-sm text-[#8a5b00]">
        Report data is locked until the FDA sends the final report and discloses treatment assignments.
      </div>
      <DataCard title="Awaiting FDA Report">
        <div class="p-[18px] text-sm text-muted">
          Once the report is released, authorized roles can compare treatment and placebo outcomes here.
        </div>
      </DataCard>
    </template>

    <template v-else>
      <div class="mb-5 grid grid-cols-3 gap-3 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1">
        <StatCard label="Report Rows">{{ rows.length }}</StatCard>
        <StatCard label="Treatment Group">{{ treatmentRows.length }}</StatCard>
        <StatCard label="Placebo Group">{{ placeboRows.length }}</StatCard>
        <StatCard label="Avg Treatment Reduction">{{ formatReduction(treatmentAverage) }}</StatCard>
        <StatCard label="Avg Placebo Reduction">{{ formatReduction(placeboAverage) }}</StatCard>
        <StatCard label="Adverse Events">{{ totalAdverseEvents(rows) }}</StatCard>
      </div>

      <DataCard title="Treatment / Placebo Comparison">
        <DataTable>
          <thead>
            <tr>
              <th>Group</th>
              <th>Patients</th>
              <th>Average Reduction</th>
              <th>Adverse Events</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><StatusBadge tone="red">Treatment</StatusBadge></td>
              <td>{{ treatmentRows.length }}</td>
              <td>{{ formatReduction(treatmentAverage) }}</td>
              <td>{{ treatmentAdverseEvents }}</td>
            </tr>
            <tr>
              <td><StatusBadge tone="blue">Placebo</StatusBadge></td>
              <td>{{ placeboRows.length }}</td>
              <td>{{ formatReduction(placeboAverage) }}</td>
              <td>{{ placeboAdverseEvents }}</td>
            </tr>
          </tbody>
        </DataTable>
      </DataCard>

      <DataCard title="Outcome by Patient">
        <DataTable>
          <thead>
            <tr>
              <th>Patient</th>
              <th>UUID</th>
              <th>Group</th>
              <th>Start</th>
              <th>End</th>
              <th>Reduction</th>
              <th>Adverse Events</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!displayRows.length">
              <td colspan="7" class="text-muted">No eligible assigned patients are ready for reporting.</td>
            </tr>
            <tr v-for="row in displayRows" :key="row.patientId">
              <td>
                <strong>{{ row.patientName }}</strong>
              </td>
              <td class="font-mono text-xs text-fda">{{ row.patientId }}</td>
              <td>
                <StatusBadge :tone="row.groupTone">{{ row.groupLabel }}</StatusBadge>
              </td>
              <td>{{ row.startValue }}</td>
              <td>{{ row.endValue }}</td>
              <td>{{ row.reductionLabel }}</td>
              <td>{{ row.adverseEvents }}</td>
            </tr>
          </tbody>
        </DataTable>
      </DataCard>

      <DataCard title="Adverse Event Detail">
        <DataTable>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Event Count</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!adverseEventRows.length">
              <td colspan="3" class="text-muted">No adverse events recorded.</td>
            </tr>
            <tr v-for="row in adverseEventRows" :key="row.patientId">
              <td>{{ row.patientName }}</td>
              <td>{{ row.adverseEventCount }}</td>
              <td>{{ row.adverseEvents }}</td>
            </tr>
          </tbody>
        </DataTable>
      </DataCard>
    </template>
  </div>
</template>
