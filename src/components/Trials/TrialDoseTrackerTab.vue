<script setup lang="ts">
import {
    DataCard,
    PaginationControls,
    ProgressBar,
    TrialDoseStatusTable,
} from "@/components";
import { computed, ref, watch } from "vue";

import { completedDoseCount, totalDosesGiven } from "@/composables";
import { useAuthStore } from "@/stores";
import { canShowPatientPii } from "@/utils";
import type { Patient, Trial, TrialEnrollmentMap } from "@/types";

const props = defineProps<{
    trial: Trial;
    patients: Patient[];
    enrollments: TrialEnrollmentMap;
}>();

const auth = useAuthStore();
const PAGE_SIZE = 20;
const page = ref(1);
const query = ref("");

const pii = computed(() => canShowPatientPii(auth.selectedPortalId));
const completedCount = computed(() =>
    completedDoseCount(props.trial, props.patients, props.enrollments),
);
const totalDoses = computed(() =>
    totalDosesGiven(props.patients, props.enrollments),
);
const requiredDoses = computed(
    () => props.patients.length * props.trial.dosesPerPatient,
);
const remainingDoses = computed(() =>
    Math.max(0, requiredDoses.value - totalDoses.value),
);
const completionPct = computed(() =>
    requiredDoses.value
        ? Math.round((totalDoses.value / requiredDoses.value) * 100)
        : 0,
);
const filteredPatients = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return props.patients;
    return props.patients.filter((patient) =>
        [patient.name, patient.id].some((value) =>
            value.toLowerCase().includes(q),
        ),
    );
});
const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredPatients.value.length / PAGE_SIZE)),
);
const pagedPatients = computed(() =>
    filteredPatients.value.slice(
        (page.value - 1) * PAGE_SIZE,
        page.value * PAGE_SIZE,
    ),
);

watch([() => props.patients, query], () => {
    page.value = 1;
});

function changePage(delta: number) {
    page.value = Math.min(pageCount.value, Math.max(1, page.value + delta));
}

</script>

<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
                <div class="font-serif text-2xl font-normal">Dose Tracker</div>
                <div class="mt-0.5 text-[13px] text-muted">
                    Per-patient dose progress for {{ trial.name }}.
                    {{
                        pii
                            ? "Includes Jane Hopkins patient identifiers."
                            : "No PII."
                    }}
                </div>
            </div>
            <div class="flex w-full justify-center md:w-auto md:justify-end">
                <input
                    v-model="query"
                    class="min-h-10 w-full min-w-0 max-w-[340px] rounded-[5px] border-[1.5px] border-rule bg-bg px-4 py-3 text-center text-base text-ink focus:border-fda focus:bg-surface focus:outline-none md:w-[280px] md:text-left"
                    placeholder="Search patients..."
                />
            </div>
        </div>
        <DataCard title="Overall Progress">
            <template #header>
                <span class="font-mono text-xs text-fda"
                    >{{ completedCount }}/{{ patients.length }} patients
                    complete</span
                >
            </template>
            <div class="px-[18px] py-4">
                <ProgressBar :value="completionPct" />
                <div class="mt-2 flex justify-between gap-3 text-xs text-muted">
                    <span>{{ totalDoses }} doses administered</span>
                    <span>{{ remainingDoses }} remaining</span>
                </div>
            </div>
        </DataCard>
        <TrialDoseStatusTable
            :pii="pii"
            :portal-id="auth.selectedPortalId"
            :trial="trial"
            :patients="pagedPatients"
            :enrollments="enrollments"
        />
        <div v-if="pageCount > 1" class="mt-3">
            <PaginationControls
                :page="page"
                :pages="pageCount"
                @change="changePage"
            />
        </div>
    </div>
</template>
