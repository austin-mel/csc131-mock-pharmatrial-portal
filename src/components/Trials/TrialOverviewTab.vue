<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import DataCard from "@/components/Dashboard/DataCard.vue";
import DetailGrid from "@/components/Dashboard/DetailGrid.vue";
import StatCard from "@/components/Dashboard/StatCard.vue";
import StatusBadge from "@/components/StatusBadge/StatusBadge.vue";
import { SvgIcon } from "@/assets";
import {
  approvalLabel,
  approvalTone,
  canApproveTrial,
  completedDoseCount,
  currentLifecycleStepIndex,
  eligiblePatients,
  enrolledPatients,
  lifecycleSteps,
  rejectedStepIndex,
  totalDosesGiven,
  trialApprovals,
} from "@/composables";
import { useAuthStore, useUiStore } from "@/stores";
import type { Patient, PortalId, Trial, TrialEnrollmentMap } from "@/types";

const props = withDefaults(
  defineProps<{
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
    allDosed?: boolean;
  }>(),
  { allDosed: false },
);
const auth = useAuthStore();
const ui = useUiStore();
const steps = lifecycleSteps;
type ApprovalAction = Extract<PortalId, "fda" | "jh-admin">;

const items = computed(() => [
  { label: "Trial ID", value: props.trial.id },
  { label: "Phase", value: props.trial.phase },
  { label: "Drug", value: props.trial.drug },
  { label: "Condition", value: props.trial.condition },
  { label: "Start Date", value: props.trial.start },
  { label: "Est. End", value: props.trial.end },
  { label: "Target Enrollment", value: props.trial.enrollment ?? "-" },
  { label: "Doses per Patient", value: props.trial.dosesPerPatient },
]);

const enrolledCount = computed(() => enrolledPatients(props.patients, props.enrollments).length);
const eligibleCount = computed(() => eligiblePatients(props.patients, props.enrollments).length);
const completedCount = computed(() => completedDoseCount(props.trial, props.patients, props.enrollments));
const totalDoses = computed(() => totalDosesGiven(props.patients, props.enrollments));
const requiredDoses = computed(() => eligibleCount.value * props.trial.dosesPerPatient);
const remainingDoses = computed(() => Math.max(0, requiredDoses.value - totalDoses.value));
const completionPct = computed(() =>
  eligibleCount.value ? Math.round((completedCount.value / eligibleCount.value) * 100) : 0,
);
const overviewCards = computed(() => {
  const remainingCard = {
    label: "Remaining Doses",
    sub: `of ${requiredDoses.value} total`,
    value: remainingDoses.value,
  };

  return [
    auth.selectedPortalId === "jh-admin"
      ? { label: "Enrolled Patients", sub: "assigned to trial", value: enrolledCount.value }
      : { label: "Eligible Patients", sub: "treatment population", value: eligibleCount.value },
    auth.selectedPortalId === "jh-admin"
      ? { label: "Eligible", sub: "meet criteria", value: eligibleCount.value }
      : { label: "Doses per Patient", sub: "trial schedule", value: props.trial.dosesPerPatient },
    remainingCard,
    { label: "Completion", sub: `${completedCount.value}/${eligibleCount.value} patients`, value: `${completionPct.value}%` },
  ];
});
const currentStep = computed(() => currentLifecycleStepIndex(props.trial, props.allDosed));
const rejectedIndex = computed(() => rejectedStepIndex(props.trial));
const finalReportPublished = computed(() => Boolean(props.trial.disclosed && props.trial.notifiedFDA));
const approvalAction = computed<ApprovalAction | null>(() => {
  const hasAssignedPatients = Object.keys(props.enrollments).length > 0;
  if (!canApproveTrial(props.trial, auth.selectedPortalId, hasAssignedPatients)) return null;
  if (auth.selectedPortalId === "fda") return "fda";
  if (auth.selectedPortalId === "jh-admin") return "jh-admin";
  return null;
});

const approvalRows = computed(() => {
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
      label: "Dosing Complete",
      sub: "All patients complete dosing",
      value: props.allDosed || props.trial.status === "complete" || props.trial.notifiedFDA ? "Complete" : "Pending",
      tone: props.allDosed || props.trial.status === "complete" || props.trial.notifiedFDA ? ("green" as const) : ("yellow" as const),
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

function isRejectedStep(index: number) {
  return rejectedIndex.value === index;
}

function stepClasses(index: number) {
  if (isRejectedStep(index)) return "border-bav bg-bav text-white";
  if (props.trial.status === "rejected" && rejectedIndex.value !== null && index > rejectedIndex.value) {
    return "border-rule bg-transparent text-muted";
  }
  if (index <= currentStep.value) return "border-jh bg-jh text-white";
  if (index === currentStep.value + 1) return "border-fda text-fda";
  return "border-rule";
}

function review(action: ApprovalAction | null) {
  if (!action || approvalAction.value !== action) return;
  ui.showModal("approval");
}
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="min-w-0">
        <div class="font-serif text-2xl font-normal">Trial Overview</div>
        <div class="mt-0.5 max-w-3xl text-[13px] text-muted">{{ trial.description }}</div>
      </div>
      <div
        v-if="approvalAction"
        class="grid gap-3 sm:flex sm:flex-wrap sm:justify-end lg:shrink-0"
      >
        <ActionButton
          class="min-h-12 w-full px-7 text-base sm:w-auto lg:min-h-16 lg:min-w-40 lg:px-10 lg:text-lg"
          :variant="approvalAction === 'fda' ? 'fda' : 'jh'"
          @click="review(approvalAction)"
        >
          Review Trial
        </ActionButton>
      </div>
    </div>
    <div class="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
      <StatCard
        v-for="card in overviewCards"
        :key="card.label"
        :label="card.label"
        :sub="card.sub"
      >
        {{ card.value }}
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
  </div>
</template>
