<script setup lang="ts">
import { DataCard, StatusBadge } from "@/components";
import { approvalLabel, approvalTone, trialApprovals } from "@/composables";
import type { Trial } from "@/types";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        trial: Trial;
        allDosed?: boolean;
    }>(),
    { allDosed: false },
);

const finalReportPublished = computed(() =>
    Boolean(props.trial.disclosed && props.trial.notifiedFDA),
);
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
            value: props.trial.batchSubmitted
                ? (props.trial.batchRef ?? "Submitted")
                : "Awaiting Approvals",
            tone: props.trial.batchSubmitted
                ? ("green" as const)
                : ("yellow" as const),
        },
        {
            label: "FDA Assignment",
            sub: "FDA assigns Bavaria/placebo to UUIDs",
            value: props.trial.assignmentsLocked ? "Locked" : "Awaiting Batch",
            tone: props.trial.assignmentsLocked
                ? ("green" as const)
                : ("yellow" as const),
        },
        {
            label: "Dosing Complete",
            sub: "All patients complete dosing",
            value:
                props.allDosed ||
                props.trial.status === "complete" ||
                props.trial.notifiedFDA
                    ? "Complete"
                    : "Pending",
            tone:
                props.allDosed ||
                props.trial.status === "complete" ||
                props.trial.notifiedFDA
                    ? ("green" as const)
                    : ("yellow" as const),
        },
        {
            label: "JH Results to FDA",
            sub: "Admin transmits anonymized results",
            value: props.trial.notifiedFDA ? "Transmitted" : "Pending",
            tone: props.trial.notifiedFDA
                ? ("green" as const)
                : ("yellow" as const),
        },
        {
            label: "FDA Report to Bavaria and JH",
            sub: "FDA publishes report with de-anon PII for Jane Hopkins",
            value: finalReportPublished.value ? "Published" : "Pending",
            tone: finalReportPublished.value
                ? ("green" as const)
                : ("yellow" as const),
        },
    ];
});
</script>

<template>
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
</template>
