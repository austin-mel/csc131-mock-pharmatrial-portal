<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <select
    v-model="model"
    class="w-full rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-3 py-[9px] text-[13px] text-[#1a1714]"
  >
    <slot />
  </select>
</template>
