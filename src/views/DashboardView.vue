<script setup lang="ts">
import { computed, ref } from "vue";
import { SvgIcon } from "@/assets";
import { ApprovalBanner, CreateTrialModal, ToastStack, TopNav, TrialSidebar, TrialWorkspace } from "@/components";
import { allEligibleDosed, needsReview } from "@/composables";
import { useAuthStore, usePatientsStore, useTrialsStore } from "@/stores";
import type { Trial } from "@/types";

const auth = useAuthStore();
const patients = usePatientsStore();
const trials = useTrialsStore();
const sidebarOpen = ref(false);
const createModalOpen = ref(false);

function trialNeedsReview(trial: Trial) {
  return needsReview(
    trial,
    auth.selectedPortalId,
    allEligibleDosed(trial, patients.patients, trials.enrollmentsFor(trial.id)),
  );
}

const reviewCount = computed(() =>
  auth.selectedPortalId === "bavaria" ? 0 : trials.trials.filter(trialNeedsReview).length,
);

function jumpToReview() {
  const trial = trials.trials.find(trialNeedsReview);
  if (trial) trials.selectTrial(trial.id);
}
</script>

<template>
  <div class="flex min-h-screen min-w-0 flex-col">
    <TopNav />
    <ApprovalBanner
      :count="reviewCount"
      @jump="jumpToReview"
    />
    <div class="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <button
        class="absolute left-3 top-3 z-[360] grid size-10 place-items-center rounded-md border border-rule bg-surface text-ink shadow-app md:hidden"
        type="button"
        aria-label="Open clinical trials menu"
        @click="sidebarOpen = true"
      >
        <SvgIcon name="menu" />
      </button>
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-[390] bg-black/35 md:hidden"
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
