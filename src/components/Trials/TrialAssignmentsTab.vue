<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import AssignmentPreviewTable from "@/components/AssignmentPreviewTable/AssignmentPreviewTable.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import { calculateBatch } from "@/composables";
import { useUiStore } from "@/stores";
import type { Patient, Trial, TrialAssignmentMap, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
  trial: Trial;
  patients: Patient[];
  enrollments: TrialEnrollmentMap;
  assignments: TrialAssignmentMap;
}>();

const ui = useUiStore();
const batch = computed(() => calculateBatch(props.patients.length, props.trial));
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
      <div>
        <div class="font-serif text-2xl font-normal">Drug Assignments</div>
        <div class="mt-0.5 text-[13px] text-muted">Private FDA mapping until disclosure.</div>
      </div>
      <ActionButton
        v-if="trial.batchSubmitted && !trial.assignmentsLocked"
        variant="fda"
        @click="ui.showModal('fda-assignment')"
      >
        Randomize Assignments
      </ActionButton>
    </div>
    <div class="mb-5 rounded-md border border-[#f3d7a2] bg-[#fff8e8] px-3 py-2 text-sm text-[#8a5a00]">
      This table is strictly confidential. Assignments remain hidden from all other parties until end-of-trial disclosure.
    </div>
    <div v-if="!trial.batchSubmitted" class="rounded-md border border-rule bg-bg px-[18px] py-5 text-sm text-muted">
      Bavaria must submit the drug batch before assignments can be made.
    </div>
    <template v-else>
      <AssignmentPreviewTable
        :patients="patients"
        :assignments="assignments"
        :enrollments="enrollments"
        :doses-per-patient="trial.dosesPerPatient"
        :locked="trial.assignmentsLocked"
      />
      <DataCard title="Batch Details">
        <div class="grid grid-cols-4 gap-3.5 px-[18px] py-4 max-[780px]:grid-cols-2 max-[520px]:grid-cols-1">
          <div>
            <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Batch Ref</div>
            <div class="font-mono text-xs text-fda">{{ trial.batchRef ?? "-" }}</div>
          </div>
          <div>
            <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Total Vials</div>
            <strong>{{ batch.totalVials }}</strong>
          </div>
          <div>
            <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Bavaria Drug</div>
            <strong>{{ batch.treatment }}</strong>
            <div class="text-xs text-muted">{{ batch.treatmentPatients }} patients</div>
          </div>
          <div>
            <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Placebo</div>
            <strong>{{ batch.placebo }}</strong>
            <div class="text-xs text-muted">{{ batch.placeboPatients }} patients</div>
          </div>
        </div>
      </DataCard>
    </template>
  </div>
</template>
