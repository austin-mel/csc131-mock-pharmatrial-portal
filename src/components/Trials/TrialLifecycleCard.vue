<script setup lang="ts">
import { DataCard } from "@/components";
import { SvgIcon } from "@/assets";
import {
    currentLifecycleStepIndex,
    lifecycleSteps,
    rejectedStepIndex,
} from "@/composables";
import type { Trial } from "@/types";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        trial: Trial;
        allDosed?: boolean;
    }>(),
    { allDosed: false },
);

const steps = lifecycleSteps;
const currentStep = computed(() =>
    currentLifecycleStepIndex(props.trial, props.allDosed),
);
const rejectedIndex = computed(() => rejectedStepIndex(props.trial));

function isRejectedStep(index: number) {
    return rejectedIndex.value === index;
}

function stepClasses(index: number) {
    if (isRejectedStep(index)) return "border-bav bg-bav text-white";
    if (
        props.trial.status === "rejected" &&
        rejectedIndex.value !== null &&
        index > rejectedIndex.value
    ) {
        return "border-rule bg-transparent text-muted";
    }
    if (index <= currentStep.value) return "border-jh bg-jh text-white";
    if (index === currentStep.value + 1) return "border-fda text-fda";
    return "border-rule";
}
</script>

<template>
    <DataCard title="Trial Lifecycle">
        <div
            class="grid grid-cols-8 gap-2 p-[18px] max-[1100px]:grid-cols-4 max-[700px]:grid-cols-2"
        >
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
</template>
