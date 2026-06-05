<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string;
    placeholder?: string;
    readonly?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
  }>(),
  { type: "text", placeholder: "" },
);
const model = defineModel<string | number | null>();
</script>

<template>
  <input
    v-model="model"
    class="min-h-10 w-full min-w-0 rounded-[5px] border-[1.5px] border-rule bg-bg px-3 py-[9px] text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:text-[13px]"
    :type="type"
    :placeholder="placeholder"
    :readonly="readonly"
    :min="min"
    :max="max"
    :step="step"
  />
</template>
