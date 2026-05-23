<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <label class="mb-[13px] block">
    <span
      class="mb-[5px] block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6b6560]"
    >
      {{ label }}
    </span>
    <slot />
  </label>
</template>
