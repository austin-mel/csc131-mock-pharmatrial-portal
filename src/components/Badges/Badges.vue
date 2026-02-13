<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const colors: Record<string, string> = {
  Pending: 'bg-yellow-400 text-black',
  Active: 'bg-blue-600 text-white',
  Completed: 'bg-green-600 text-white',
  Rejected: 'bg-red-600 text-white'
}
</script>

<template>
  <span
    class="px-2 py-1 rounded text-xs font-semibold"
    :class="colors[status] || 'bg-gray-300 text-black'"
  >
    {{ status }}
  </span>
</template>
