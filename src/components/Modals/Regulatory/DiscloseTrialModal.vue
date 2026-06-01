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

const canDisclose = computed(() =>
  auth.selectedPortalId === "fda" &&
  props.trial.notifiedFDA &&
  props.trial.assignmentsLocked &&
  props.allDosed &&
  !props.trial.disclosed,
);

function disclose() {
  const saved = trials.discloseTrial(props.trial.id, auth.selectedPortalId, props.allDosed);
  if (!saved) {
    ui.pushToast("Disclosure is locked until FDA notification, locked assignments, and complete dosing are all present.", "error");
    return;
  }

  ui.pushToast("Assignments disclosed. Trial marked complete.", "success");
  emit("close");
}
</script>

<template>
  <ModalShell :open="open" title="Disclose Trial Assignments" @close="$emit('close')">
    <p class="mb-4 rounded-md border border-[#f0b8b0] bg-[#fdecea] px-3 py-2 text-sm text-[#9b1c11]">
      Publish the final report and reveal treatment assignments to all parties. This marks the trial complete.
    </p>
    <div class="grid grid-cols-3 gap-3 text-sm max-[640px]:grid-cols-1">
      <div class="rounded-md border border-rule px-3 py-2">
        <div class="font-mono text-[10px] uppercase tracking-[.12em] text-muted">JH Notice</div>
        <strong>{{ trial.notifiedFDA ? "Received" : "Pending" }}</strong>
      </div>
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
          variant="danger"
          :disabled="!canDisclose"
          @click="disclose"
        >
          Disclose
        </ActionButton>
      </div>
    </template>
  </ModalShell>
</template>
