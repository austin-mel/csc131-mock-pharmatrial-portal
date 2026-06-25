<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
    ApprovalBanner,
    CreateTrialModal,
    ToastStack,
    TopNav,
    TrialSidebar,
    TrialWorkspace,
} from "@/components";
import { allEligibleDosed, needsReview } from "@/composables";
import { useAuthStore, usePatientsStore, useTrialsStore } from "@/stores";
import type { Trial } from "@/types";

const auth = useAuthStore();
const patients = usePatientsStore();
const trials = useTrialsStore();
const sidebarOpen = ref(false);
const createModalOpen = ref(false);
const loadingLiveData = computed(
    () => trials.apiHydrating && !trials.apiFallback,
);

onMounted(() => {
    void trials.hydrateFromApi();
});

function trialNeedsReview(trial: Trial) {
    return needsReview(
        trial,
        auth.selectedPortalId,
        allEligibleDosed(
            trial,
            patients.patients,
            trials.enrollmentsFor(trial.id),
        ),
    );
}

const reviewCount = computed(() =>
    auth.selectedPortalId === "bavaria"
        ? 0
        : trials.trials.filter(trialNeedsReview).length,
);

function jumpToReview() {
    const trial = trials.trials.find(trialNeedsReview);
    if (trial) trials.selectTrial(trial.id);
}
</script>

<template>
    <div class="flex min-h-screen min-w-0 flex-col">
        <TopNav @menu="sidebarOpen = true" />
        <ApprovalBanner
            v-if="!loadingLiveData"
            :count="reviewCount"
            @jump="jumpToReview"
        />
        <div
            v-if="loadingLiveData"
            class="grid min-h-0 flex-1 place-items-center bg-bg px-6"
        >
            <div class="grid justify-items-center gap-4 text-center">
                <div
                    class="size-12 animate-spin rounded-full border-4 border-rule border-t-fda"
                    role="status"
                    aria-label="Loading trial data"
                ></div>
                <div>
                    <div class="font-serif text-xl text-ink">
                        Loading trial data
                    </div>
                    <div class="mt-1 text-sm text-muted">
                        Fetching live records from the database.
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
        >
            <div
                v-if="sidebarOpen"
                class="fixed inset-0 z-[390] bg-black/35 lg:hidden"
                @click="sidebarOpen = false"
            ></div>
            <TrialSidebar
                :open="sidebarOpen"
                @close="sidebarOpen = false"
                @create="createModalOpen = true"
            />
            <main
                class="flex min-w-0 flex-1 flex-col overflow-y-auto bg-bg"
                aria-label="Blank trial workspace"
            >
                <TrialWorkspace />
            </main>
        </div>
        <CreateTrialModal
            :open="createModalOpen"
            @close="createModalOpen = false"
        />
        <ToastStack />
    </div>
</template>
