<script setup lang="ts">
const props = defineProps<{
  label: string
  color?: 'blue' | 'red' | 'green' | 'purple'
  disabled?: boolean
}>()

const emit = defineEmits(['click'])

const colorClass = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  red: 'bg-red-500 hover:bg-red-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600'
}
</script>

<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :class="[
      'px-3 py-2 text-white rounded transition',
      disabled ? 'opacity-50 cursor-not-allowed' : colorClass[color ?? 'blue']
    ]"
  >
    {{ label }}
  </button>
</template>
