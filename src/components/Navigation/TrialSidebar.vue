<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "../ActionButton/ActionButton.vue";
import { SvgIcon } from "@/assets";
import PaginationControls from "./PaginationControls.vue";
import SearchInput from "../SearchInput/SearchInput.vue";
import SegmentedControl from "./SegmentedControl.vue";
import TrialSidebarListItem from "../Trials/TrialSidebarListItem.vue";
import { useTrialsStore, useAuthStore } from "@/stores";

defineProps<{ open?: boolean }>();
const emit = defineEmits<{ close: []; create: [] }>();
const trials = useTrialsStore();
const auth = useAuthStore();
const filterOptions = computed(() =>
  auth.selectedPortalId === "bavaria"
    ? [
        { label: "Current", value: "current" },
        { label: "Archived", value: "archived" },
      ]
    : [
        { label: "Current", value: "current" },
        { label: "Completed", value: "archived" },
      ],
);
const filterModel = computed({
  get: () => (trials.showingArchived ? "archived" : "current"),
  set: (value: string) => trials.setArchiveFilter(value === "archived"),
});

function selectTrial(id: string) {
  trials.selectTrial(id);
  emit("close");
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-[400] flex w-[min(320px,88vw)] shrink-0 flex-col overflow-x-hidden overflow-y-hidden border-r border-rule bg-surface shadow-app-lg transition-transform duration-200 lg:static lg:z-auto lg:w-[230px] lg:max-w-none lg:translate-x-0 lg:shadow-none"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="grid min-w-0 gap-2 border-b border-rule px-[18px] pb-2.5 pt-4">
      <div class="flex items-center justify-between gap-2">
        <div class="font-mono text-[9px] uppercase tracking-[.18em] text-muted">
          Clinical Trials
        </div>
        <button
          class="grid size-8 place-items-center rounded border-0 bg-transparent text-muted hover:bg-bg hover:text-ink lg:hidden"
          type="button"
          aria-label="Close clinical trials menu"
          @click="$emit('close')"
        >
          <SvgIcon name="close" />
        </button>
      </div>
      <SearchInput
        :model-value="trials.sidebarSearch"
        placeholder="Search trials..."
        @update:model-value="trials.setSearch"
      />
      <SegmentedControl
        v-model="filterModel"
        :options="filterOptions"
      />
      <ActionButton
        v-if="auth.selectedPortalId === 'bavaria'"
        variant="bav"
        block
        @click="$emit('create')"
      >
        <SvgIcon name="add" />
        New Trial
      </ActionButton>
    </div>
    <div class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-2">
      <TrialSidebarListItem
        v-for="trial in trials.visibleTrials"
        :key="trial.id"
        :trial="trial"
        :active="trial.id === trials.currentTrialId"
        @select="selectTrial"
      />
      <div class="min-w-0 px-[18px] py-3">
        <PaginationControls
          :page="trials.sidebarPage"
          :pages="trials.pageCount"
          @change="trials.changePage"
        />
      </div>
    </div>
  </aside>
</template>
