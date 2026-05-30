<script setup lang="ts">
import { computed, watch } from "vue";

import DataCard from "@/components/Dashboard/DataCard.vue";
import RejectedTrialBanner from "@/components/Trials/RejectedTrialBanner.vue";
import TrialBanner from "@/components/Trials/TrialBanner.vue";
import TrialOverviewTab from "@/components/Trials/TrialOverviewTab.vue";
import TrialTabBar from "@/components/Trials/TrialTabBar.vue";
import { getVisibleTabs } from "@/composables";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type { TrialTab } from "@/types";

const auth = useAuthStore();
const trials = useTrialsStore();
const ui = useUiStore();

const trial = computed(() => trials.currentTrial);
const tabs = computed<TrialTab[]>(() =>
  trial.value ? getVisibleTabs(trial.value, auth.selectedPortalId) : ["overview"],
);
const canArchive = computed(() => Boolean(trial.value));

const placeholderTitles: Record<Exclude<TrialTab, "overview">, string> = {
  patients: "Patients",
  appointments: "Appointments",
  doses: "Dose Tracker",
  notify: "Notify FDA",
  assignments: "Assignments",
  disclose: "Disclose",
  batch: "Drug Batch",
  report: "Report",
};

watch(
  tabs,
  (visibleTabs) => {
    if (!visibleTabs.includes(ui.activeTab)) ui.switchTab("overview");
  },
  { immediate: true },
);

function archive() {
  if (!trial.value) return;
  trials.toggleArchive(trial.value.id);
}

function deleteTrial() {
  if (!trial.value) return;
  const confirmed = window.confirm(`Delete ${trial.value.name}? This cannot be undone.`);
  if (!confirmed) return;
  trials.deleteTrial(trial.value.id);
}
</script>

<template>
  <div v-if="trial" class="flex min-h-0 flex-1 flex-col">
    <TrialBanner
      :trial="trial"
      :can-archive="canArchive"
      @archive="archive"
      @delete="deleteTrial"
    />
    <RejectedTrialBanner
      v-if="trial.status === 'rejected'"
    />
    <TrialTabBar
      :tabs="tabs"
      :active="ui.activeTab"
      @change="ui.switchTab"
    />
    <main class="p-7 max-[640px]:p-4">
      <TrialOverviewTab
        v-if="ui.activeTab === 'overview'"
        :trial="trial"
      />
      <DataCard
        v-else
        :title="placeholderTitles[ui.activeTab]"
      >
        <div class="px-[18px] py-5 text-sm text-muted">
          {{ placeholderTitles[ui.activeTab] }}
        </div>
      </DataCard>
    </main>
  </div>
</template>
