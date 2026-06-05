<script setup lang="ts">
defineProps<{ src: string; alt: string; large?: boolean }>();
</script>

<template>
  <div
    class="mb-1.5 flex h-11 w-full items-center justify-center overflow-hidden xs:mb-2 xs:h-14"
  >
    <img
      class="block object-contain"
      :class="large ? 'h-12 w-24 xs:h-[65px] xs:w-[130px]' : 'h-10 w-20 xs:h-12 xs:w-24'"
      :src="src"
      :alt="alt"
    />
  </div>
</template>
