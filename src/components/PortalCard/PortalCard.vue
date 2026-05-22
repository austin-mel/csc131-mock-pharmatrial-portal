<template>
  <button
    class="min-w-0 rounded-md border-2 p-[13px] text-left transition-all duration-150"
    :class="selected ? selectedClasses[portal.id] : 'border-rule bg-[#faf9f7]'"
    type="button"
    @click="$emit('select', portal.id)"
  >
    <PartnerLogo :src="portal.logo" :alt="portal.label" :fda="portal.id === 'fda'" />
    <div class="mb-0.5 text-center text-[13px] font-semibold" :class="labelClasses[portal.id]">
      {{ portal.label }}
    </div>
    <div class="text-center font-mono text-[11px] text-muted">{{ portal.role }}</div>
  </button>
</template>

<script setup lang="ts">
import PartnerLogo from "@/components/PortalCard/PartnerLogo.vue";
import type { Portal } from "@/types/portal";

defineProps<{ portal: Portal; selected?: boolean }>();
defineEmits<{ select: [id: Portal["id"]] }>();

const selectedClasses = {
  "jh-doctor": "border-jh bg-jh-light",
  "jh-admin": "border-jh bg-jh-light",
  fda: "border-fda bg-fda-light",
  bavaria: "border-bav bg-bav-light",
} as const;

const labelClasses = {
  "jh-doctor": "text-jh",
  "jh-admin": "text-jh",
  fda: "text-fda",
  bavaria: "text-bav",
} as const;
</script>
