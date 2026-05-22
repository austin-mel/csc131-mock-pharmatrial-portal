<template>
  <div class="mb-2 flex h-14 w-full items-center justify-center overflow-hidden">
    <img
      class="block max-h-[54px] max-w-[156px] object-contain"
      :class="{ 'max-h-9 max-w-[84px]': fda }"
      :src="src"
      :alt="alt"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ src: string; alt: string; fda?: boolean }>();
</script>
