<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: number }>();

const width = computed(() => `${Math.min(100, Math.max(0, props.value))}%`);
</script>

<template>
  <div class="h-2 overflow-hidden rounded bg-rule">
    <div
      class="h-full rounded bg-jh transition-[width] duration-[400ms]"
      :style="{ width }"
    ></div>
  </div>
</template>
