<script setup lang="ts">
import type { Trial } from "@/types";
defineProps<{ trial: Trial; active?: boolean }>();
defineEmits<{ select: [id: string] }>();
</script>

<template>
  <button
    class="block w-full min-w-0 overflow-hidden border-0 border-l-[3px] px-[18px] py-2.5 text-left hover:bg-bg"
    :class="
      active ? 'border-l-fda bg-bg' : 'border-l-transparent bg-transparent'
    "
    type="button"
    @click="$emit('select', trial.id)"
  >
    <div
      class="mb-0.5 break-words text-[13px] font-semibold leading-[1.3] text-ink"
    >
      {{ trial.name }}
    </div>
    <div class="truncate font-mono text-[10px] text-muted">
      {{ trial.id }}
    </div>
    <div class="mt-[5px] flex min-w-0 flex-wrap gap-1">
      <span
        class="rounded-full border border-rule bg-bg px-2 py-0.5 font-mono text-[9px] uppercase tracking-[.08em] text-muted"
      >
        {{ trial.statusLabel }}
      </span>
      <span
        class="rounded-full border border-rule bg-bg px-2 py-0.5 font-mono text-[9px] uppercase tracking-[.08em] text-muted"
      >
        {{ trial.phase }}
      </span>
    </div>
  </button>
</template>
