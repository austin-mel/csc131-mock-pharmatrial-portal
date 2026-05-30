<script setup lang="ts">
defineProps<{ filled?: boolean; complete?: boolean }>();
</script>

<template>
  <span
    class="inline-block size-2.5 rounded-sm"
    :class="filled ? complete ? 'bg-[#1e7e4e]' : 'bg-[#2a5c8f]' : 'bg-[#dedad3]'"
  />
</template>
