<script setup lang="ts">
import {
    ActionButton,
    StatCard,
    TrialApprovalStatusCard,
    TrialDetailsCard,
    TrialLifecycleCard,
} from "@/components";
import { computed } from "vue";

import {
    canApproveTrial,
    completedDoseCount,
    eligiblePatients,
    enrolledPatients,
    totalDosesGiven,
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

const enrolledCount = computed(
    () => enrolledPatients(props.patients, props.enrollments).length,
);
const eligibleCount = computed(
    () => eligiblePatients(props.patients, props.enrollments).length,
);
const completedCount = computed(() =>
    completedDoseCount(props.trial, props.patients, props.enrollments),
);
const totalDoses = computed(() =>
    totalDosesGiven(props.patients, props.enrollments),
);
const requiredDoses = computed(
    () => eligibleCount.value * props.trial.dosesPerPatient,
);
const remainingDoses = computed(() =>
    Math.max(0, requiredDoses.value - totalDoses.value),
);
const completionPct = computed(() =>
    eligibleCount.value
        ? Math.round((completedCount.value / eligibleCount.value) * 100)
        : 0,
);
const overviewCards = computed(() => {
    const remainingCard = {
        label: "Remaining Doses",
        sub: `of ${requiredDoses.value} total`,
        value: remainingDoses.value,
    };

    return [
        auth.selectedPortalId === "jh-admin"
            ? {
                  label: "Enrolled Patients",
                  sub: "assigned to trial",
                  value: enrolledCount.value,
              }
            : {
                  label: "Eligible Patients",
                  sub: "treatment population",
                  value: eligibleCount.value,
              },
        auth.selectedPortalId === "jh-admin"
            ? {
                  label: "Eligible",
                  sub: "meet criteria",
                  value: eligibleCount.value,
              }
            : {
                  label: "Doses per Patient",
                  sub: "trial schedule",
                  value: props.trial.dosesPerPatient,
              },
        remainingCard,
        {
            label: "Completion",
            sub: `${completedCount.value}/${eligibleCount.value} patients`,
            value: `${completionPct.value}%`,
        },
    ];
});
const approvalAction = computed<ApprovalAction | null>(() => {
    const hasAssignedPatients = Object.keys(props.enrollments).length > 0;
    if (
        !canApproveTrial(
            props.trial,
            auth.selectedPortalId,
            hasAssignedPatients,
        )
    )
        return null;
    if (auth.selectedPortalId === "fda") return "fda";
    if (auth.selectedPortalId === "jh-admin") return "jh-admin";
    return null;
});

function review(action: ApprovalAction | null) {
    if (!action || approvalAction.value !== action) return;
    ui.showModal("approval");
}
</script>

<template>
    <div>
        <div
            class="mb-5 flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:justify-between"
        >
            <div class="min-w-0">
                <div class="font-serif text-2xl font-normal">
                    Trial Overview
                </div>
                <div class="mt-0.5 max-w-3xl text-[13px] text-muted">
                    {{ trial.description }}
                </div>
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
        <div
            class="mb-5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
        >
            <StatCard
                v-for="card in overviewCards"
                :key="card.label"
                :label="card.label"
                :sub="card.sub"
            >
                {{ card.value }}
            </StatCard>
        </div>
        <TrialLifecycleCard :trial="trial" :all-dosed="allDosed" />
        <TrialDetailsCard :items="items" />
        <TrialApprovalStatusCard :trial="trial" :all-dosed="allDosed" />
    </div>
</template>
