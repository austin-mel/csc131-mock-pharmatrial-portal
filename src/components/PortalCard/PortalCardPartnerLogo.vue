<script setup lang="ts">
defineProps<{ src: string; alt: string; large?: boolean }>();
</script>

<template>
  <div
    class="mb-2 flex h-14 w-full items-center justify-center overflow-hidden"
  >
    <img
      class="block object-contain"
      :class="large ? 'h-[65px] w-[130px]' : 'h-12 w-24'"
      :src="src"
      :alt="alt"
    />
  </div>
</template>
