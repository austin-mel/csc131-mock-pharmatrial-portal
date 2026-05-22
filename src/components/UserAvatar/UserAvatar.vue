<template>
  <div class="flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold text-white" :class="colorClass">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ text: string; color: string }>();

const colorClass = computed(
  () =>
    ({
      "#1e7e4e": "bg-jh",
      "#2a5c8f": "bg-fda",
      "#c0392b": "bg-bav",
    })[props.color] ?? "bg-muted",
);
</script>
