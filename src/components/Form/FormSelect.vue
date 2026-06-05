<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <select
    v-model="model"
    class="min-h-10 w-full min-w-0 rounded-[5px] border-[1.5px] border-rule bg-bg px-3 py-[9px] text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:text-[13px]"
  >
    <slot />
  </select>
</template>
