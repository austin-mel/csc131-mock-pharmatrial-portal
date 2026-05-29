<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import TrialBanner from "@/components/Trials/TrialBanner.vue";
import { SvgIcon } from "@/assets";
import {
  approvalLabel,
  approvalTone,
  currentLifecycleStepIndex,
  lifecycleSteps,
  rejectedStepIndex,
  statusBadges,
  trialApprovals,
} from "@/composables";
import { useAuthStore, useTrialsStore } from "@/stores";
import type { PortalId, Trial } from "@/types";

const props = defineProps<{ trial: Trial | null }>();
const auth = useAuthStore();
const trials = useTrialsStore();
const steps = lifecycleSteps;
type ApprovalAction = Extract<PortalId, "fda" | "jh-admin">;

const statusLabel = computed(() => {
  if (!props.trial) return "-";
  return statusBadges(props.trial)
    .filter((badge) => badge.label !== "Archived")
    .map((badge) => badge.label)
    .join(", ");
});

const items = computed(() => {
  if (!props.trial) return [];

  return [
    { label: "Trial ID", value: props.trial.id },
    { label: "Phase", value: props.trial.phase },
    { label: "Drug", value: props.trial.drug },
    { label: "Condition", value: props.trial.condition },
    { label: "Start Date", value: props.trial.start },
    { label: "Est. End", value: props.trial.end },
    { label: "Target Enrollment", value: props.trial.enrollment ?? "-" },
    { label: "Doses per Patient", value: props.trial.dosesPerPatient },
  ];
});

const currentStep = computed(() => (props.trial ? currentLifecycleStepIndex(props.trial) : 0));
const rejectedIndex = computed(() => (props.trial ? rejectedStepIndex(props.trial) : null));
const finalReportPublished = computed(() => Boolean(props.trial?.disclosed && props.trial.notifiedFDA));
const approvalAction = computed<ApprovalAction | null>(() => {
  if (!props.trial || props.trial.status !== "pending-approval") return null;

  const approvals = trialApprovals(props.trial);
  if (auth.selectedPortalId === "fda" && approvals.fda === "pending") return "fda";
  if (auth.selectedPortalId === "jh-admin" && approvals.jh === "pending") return "jh-admin";
  return null;
});

function isRejectedStep(index: number) {
  return rejectedIndex.value === index;
}

function stepClasses(index: number) {
  if (!props.trial) return "border-rule";
  if (isRejectedStep(index)) return "border-bav bg-bav text-white";
  if (props.trial.status === "rejected" && rejectedIndex.value !== null && index > rejectedIndex.value) {
    return "border-rule bg-transparent text-muted";
  }
  if (index <= currentStep.value) return "border-jh bg-jh text-white";
  if (index === currentStep.value + 1) return "border-fda text-fda";
  return "border-rule";
}

const approvalRows = computed(() => {
  if (!props.trial) return [];

  const approvals = trialApprovals(props.trial);

  return [
    {
      label: "Bavaria Creates",
      sub: "Bavaria submits the proposed trial",
      value: props.trial.created ?? "Created",
      tone: "green" as const,
    },
    {
      label: "FDA Administration",
      sub: "Federal regulatory review first",
      value: approvalLabel(approvals.fda),
      tone: approvalTone(approvals.fda),
    },
    {
      label: "Jane Hopkins Hospital",
      sub: "Clinical coordinator review after FDA",
      value: approvalLabel(approvals.jh),
      tone: approvalTone(approvals.jh),
    },
    {
      label: "Bavaria Ship",
      sub: "Bavaria ships after all approvals",
      value: props.trial.batchSubmitted ? props.trial.batchRef ?? "Submitted" : "Awaiting Approvals",
      tone: props.trial.batchSubmitted ? ("green" as const) : ("yellow" as const),
    },
    {
      label: "FDA Assignment",
      sub: "FDA assigns Bavaria/placebo to UUIDs",
      value: props.trial.assignmentsLocked ? "Locked" : "Awaiting Batch",
      tone: props.trial.assignmentsLocked ? ("green" as const) : ("yellow" as const),
    },
    {
      label: "Complete",
      sub: "All patients complete dosing",
      value: props.trial.status === "complete" ? "Complete" : "Pending",
      tone: props.trial.status === "complete" ? ("green" as const) : ("yellow" as const),
    },
    {
      label: "JH Results to FDA",
      sub: "Admin transmits anonymized results",
      value: props.trial.notifiedFDA ? "Transmitted" : "Pending",
      tone: props.trial.notifiedFDA ? ("green" as const) : ("yellow" as const),
    },
    {
      label: "FDA Report to Bavaria and JH",
      sub: "FDA publishes report with de-anon PII for Jane Hopkins",
      value: finalReportPublished.value ? "Published" : "Pending",
      tone: finalReportPublished.value ? ("green" as const) : ("yellow" as const),
    },
  ];
});

function approve(action: ApprovalAction | null) {
  if (!props.trial || !action || approvalAction.value !== action) return;
  trials.approveTrial(props.trial.id, action);
}

function reject(action: ApprovalAction | null) {
  if (!props.trial || !action || approvalAction.value !== action) return;
  trials.rejectTrial(props.trial.id, action);
}
</script>

<template>
  <div v-if="trial" class="flex min-h-0 flex-1 flex-col">
    <TrialBanner :trial="trial" />
    <main class="p-7 max-[640px]:p-4">
      <div class="mb-5 flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="min-w-0">
          <div class="font-serif text-2xl font-normal">Trial Overview</div>
          <div class="mt-0.5 max-w-3xl text-[13px] text-muted">{{ trial.description }}</div>
        </div>
        <div
          v-if="approvalAction"
          class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end lg:shrink-0"
        >
          <ActionButton
            class="min-h-12 w-full px-7 text-base sm:w-auto lg:min-h-16 lg:min-w-40 lg:px-10 lg:text-lg"
            variant="danger"
            @click="reject(approvalAction)"
          >
            Reject
          </ActionButton>
          <ActionButton
            class="min-h-12 w-full px-7 text-base sm:w-auto lg:min-h-16 lg:min-w-40 lg:px-10 lg:text-lg"
            variant="jh"
            @click="approve(approvalAction)"
          >
            Approve
          </ActionButton>
        </div>
      </div>
      <div class="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <StatCard label="Target Enrollment" sub="planned participants">
          {{ trial.enrollment }}
        </StatCard>
        <StatCard label="Trial Status" sub="current workflow state">
          {{ statusLabel }}
        </StatCard>
        <StatCard label="Phase" sub="clinical stage">
          {{ trial.phase }}
        </StatCard>
        <StatCard label="Doses" sub="per patient">
          {{ trial.dosesPerPatient }}
        </StatCard>
      </div>
      <DataCard title="Trial Lifecycle">
        <div class="grid grid-cols-8 gap-2 p-[18px] max-[1100px]:grid-cols-4 max-[700px]:grid-cols-2">
          <div
            v-for="(step, index) in steps"
            :key="step"
            class="text-center text-[11px] text-muted"
          >
            <div
              class="mx-auto mb-1.5 grid size-6 place-items-center rounded-full border-2 font-mono"
              :class="stepClasses(index)"
            >
              <SvgIcon v-if="isRejectedStep(index)" name="close" />
              <SvgIcon v-else-if="index <= currentStep" name="check" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div>{{ step }}</div>
          </div>
        </div>
      </DataCard>
      <DataCard title="Trial Details">
        <DetailGrid :items="items" />
      </DataCard>
      <DataCard title="Approval Status">
        <div class="px-[18px] py-1">
          <div
            v-for="row in approvalRows"
            :key="row.label"
            class="flex flex-col gap-2 border-b border-rule py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          >
            <div class="min-w-0">
              <strong>{{ row.label }}</strong>
              <span class="block text-xs text-muted">{{ row.sub }}</span>
            </div>
            <div class="sm:shrink-0">
              <StatusBadge :tone="row.tone">{{ row.value }}</StatusBadge>
            </div>
          </div>
        </div>
      </DataCard>
    </main>
  </div>
</template>
