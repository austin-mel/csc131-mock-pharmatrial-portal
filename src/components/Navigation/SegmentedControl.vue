<script setup lang="ts">
defineProps<{ options: Array<{ label: string; value: string }> }>();

const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="grid auto-cols-fr grid-flow-col gap-1.5">
    <button
      v-for="option in options"
      :key="option.value"
      class="rounded-[5px] border px-2 py-1.5 font-mono text-[10px]"
      type="button"
      :class="
        model === option.value
          ? 'border-[#1a1714] bg-[#1a1714] text-white'
          : 'border-[#dedad3] bg-[#faf9f7] text-[#6b6560]'
      "
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
