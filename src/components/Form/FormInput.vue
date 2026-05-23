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
    class="w-full rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-3 py-[9px] text-[13px] text-[#1a1714] focus:border-[#2a5c8f] focus:bg-white focus:outline-none"
    :type="type"
    :placeholder="placeholder"
    :readonly="readonly"
    :min="min"
    :max="max"
    :step="step"
  />
</template>
