<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: "Search...",
});
const model = defineModel<string>({ default: "" });
</script>

<template>
  <input
    v-model="model"
    class="w-full rounded-[5px] border-[1.5px] border-[#dedad3] bg-[#faf9f7] px-[9px] py-[7px] text-xs text-[#1a1714]"
    :placeholder="placeholder"
  />
</template>
