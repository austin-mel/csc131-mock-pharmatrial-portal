<script setup lang="ts">
defineProps<{ items: Array<{ label: string; value: string | number }> }>();
</script>

<template>
  <div class="grid grid-cols-2">
    <div
      v-for="item in items"
      :key="item.label"
      class="border-b border-[#dedad3] px-[18px] py-3"
    >
      <div
        class="mb-0.5 font-['DM_Mono',monospace] text-[10px] uppercase tracking-[.12em] text-[#6b6560]"
      >
        {{ item.label }}
      </div>
      <div class="text-[13px] font-medium">{{ item.value }}</div>
    </div>
  </div>
</template>
