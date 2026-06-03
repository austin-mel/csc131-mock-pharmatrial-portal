<script setup lang="ts">
import { computed } from "vue";

import ActionButton from "@/components/ActionButton/ActionButton.vue";
import ModalShell from "@/components/ModalShell/ModalShell.vue";
import { useAuthStore, useTrialsStore, useUiStore } from "@/stores";
import type { Trial } from "@/types";

const props = defineProps<{ open: boolean; trial: Trial; allDosed: boolean }>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuthStore();
const trials = useTrialsStore();
const ui = useUiStore();

const canNotify = computed(() =>
  auth.selectedPortalId === "jh-admin" &&
  props.trial.assignmentsLocked &&
  props.allDosed &&
  !props.trial.notifiedFDA,
);

function notify() {
  const saved = trials.notifyFda(props.trial.id, auth.selectedPortalId, props.allDosed);
  if (!saved) {
    ui.pushToast("FDA notification is locked until assignments are locked and all eligible patients are fully dosed.", "error");
    return;
  }

  ui.pushToast("Results transmitted to FDA.", "success");
  emit("close");
}
</script>

<template>
  <ModalShell :open="open" title="Notify FDA of Completion" @close="$emit('close')">
    <p class="mb-4 rounded-md border border-rule bg-bg px-3 py-2 text-sm text-muted">
      Transmit anonymized completion results to FDA. This locks the Jane Hopkins patient roster for this trial.
    </p>
    <div class="grid grid-cols-2 gap-3 text-sm max-[520px]:grid-cols-1">
      <div class="rounded-md border border-rule px-3 py-2">
        <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Assignments</div>
        <strong>{{ trial.assignmentsLocked ? "Locked" : "Pending" }}</strong>
      </div>
      <div class="rounded-md border border-rule px-3 py-2">
        <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">Dosing</div>
        <strong>{{ allDosed ? "Complete" : "Incomplete" }}</strong>
      </div>
    </div>
    <template #footer>
      <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ActionButton
          class="min-h-14 w-full px-8 text-base sm:w-auto sm:min-w-40"
          @click="$emit('close')"
        >
          Cancel
        </ActionButton>
        <ActionButton
          class="min-h-14 w-full px-8 text-base sm:w-auto sm:min-w-40"
          variant="jh"
          :disabled="!canNotify"
          @click="notify"
        >
          Notify FDA
        </ActionButton>
      </div>
    </template>
  </ModalShell>
</template>
