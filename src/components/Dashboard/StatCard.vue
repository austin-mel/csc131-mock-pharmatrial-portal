<script setup lang="ts">
defineProps<{ label: string; sub?: string }>();
</script>

<template>
  <div class="rounded-md border border-[#dedad3] bg-white px-[17px] py-[15px]">
    <div
      class="mb-1 font-['DM_Mono',monospace] text-[10px] uppercase tracking-[.12em] text-[#6b6560]"
    >
      {{ label }}
    </div>
    <div class="font-['DM_Serif_Display',serif] text-[28px] text-[#1a1714]">
      <slot />
    </div>
    <div v-if="sub" class="mt-px text-[11px] text-[#6b6560]">{{ sub }}</div>
  </div>
</template>
