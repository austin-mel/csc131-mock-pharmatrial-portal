<script setup lang="ts">
const props = defineProps<{ activeTab: string }>();
const emit = defineEmits(['update:activeTab']);

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
];

function setTab(value: string) {
  emit('update:activeTab', value);
}
</script>

<template>
  <div class="hidden sm:flex border-b border-gray-300">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="setTab(tab.value)"
      class="flex-1 text-center py-2 -mb-px mx-4 font-medium transition-colors"
      :class="activeTab === tab.value
        ? 'text-gray-600 border-b-2 border-gray-600'
        : 'text-gray-400 hover:text-gray-600'"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
