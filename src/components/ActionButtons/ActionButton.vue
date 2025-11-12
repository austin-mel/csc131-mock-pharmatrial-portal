<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  disabled?: boolean;
  color?: 'blue' | 'green' | 'red' | 'gray' | 'purple';
}>();

const colors = {
  blue: { active: 'bg-blue-500 hover:bg-blue-700', disabled: 'bg-blue-300 cursor-not-allowed opacity-50' },
  green: { active: 'bg-green-700 hover:bg-green-900', disabled: 'bg-green-400 cursor-not-allowed opacity-50' },
  red: { active: 'bg-red-600 hover:bg-red-800', disabled: 'bg-red-300 cursor-not-allowed opacity-50' },
  purple: { active: 'bg-purple-600 hover:bg-purple-800', disabled: 'bg-purple-300 cursor-not-allowed opacity-50' },
  gray: { active: 'bg-gray-500 hover:bg-gray-700', disabled: 'bg-gray-300 cursor-not-allowed opacity-50' },
} as const;

const buttonClasses = computed(() => {
  const base = 'relative flex items-center text-white font-bold py-2 px-2 rounded';
  const colorKey = props.color ?? 'gray';
  const colorMap = colors[colorKey as keyof typeof colors];

  return [base, props.disabled ? colorMap.disabled : colorMap.active];
});
</script>

<template>
  <button :disabled="disabled" :class="buttonClasses">
    <slot>{{ label }}</slot>
  </button>
</template>
