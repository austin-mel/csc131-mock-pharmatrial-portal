<script setup lang="ts">
import { computed } from "vue";

import StatusBadge from "@/components/StatusBadge";
import { statusBadges } from "@/composables";
import type { Trial } from "@/types";

const props = defineProps<{ trial: Trial; active?: boolean }>();
defineEmits<{ select: [id: string] }>();

const badges = computed(() => statusBadges(props.trial));
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
      <StatusBadge
        v-for="badge in badges"
        :key="badge.label"
        :tone="badge.tone"
      >
        {{ badge.label }}
      </StatusBadge>
    </div>
  </button>
</template>
