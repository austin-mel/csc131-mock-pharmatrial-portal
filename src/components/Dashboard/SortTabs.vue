<script setup lang="ts">
const props = defineProps<{ activeTab: string }>()
const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

const tabs = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Active', value: 'Active' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Rejected', value: 'Rejected' },
]

function setTab(value: string) {
  emit('update:activeTab', value)
}
</script>

<template>
  <div class="hidden sm:flex border-b border-gray-300">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="setTab(tab.value)"
      class="flex-1 text-center py-2 -mb-px mx-4 font-medium"
      :class="
        activeTab === tab.value
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-400 hover:text-gray-600'
      "
    >
      {{ tab.label }}
    </button>
  </div>
</template>
