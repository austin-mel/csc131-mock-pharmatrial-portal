<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: "" });
const model = defineModel<string>();
</script>

<template>
  <textarea
    v-model="model"
    class="min-h-20 w-full resize-y rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-3 py-[9px] text-[13px] text-[#1a1714]"
    :placeholder="placeholder"
  />
</template>
