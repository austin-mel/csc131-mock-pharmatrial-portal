<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  items: { type: Array as PropType<any[]>, required: true },
  fields: { type: Array as PropType<string[]>, required: true }
})
const emit = defineEmits(['update:items'])

function placeholderFor(field: string) {
  return field.charAt(0).toUpperCase() + field.slice(1)
}

function addItem() {
  const obj:any = {}
  props.fields.forEach(f => obj[f] = '')
  props.items.push(obj)
  emit('update:items', props.items)
}
</script>

<template>
  <div class="mb-4">
    <strong class="block text-left mb-2">{{ label }}:</strong>
    <div v-for="(item, idx) in items" :key="idx" class="flex gap-2 mb-1">
      <div v-for="field in fields" :key="field" class="relative group w-full">
        <input v-model="item[field]" :placeholder="placeholderFor(field)" class="border p-1 rounded w-full" />
        <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
          Enter {{ field }}
        </span>
      </div>
    </div>
    <div class="flex justify-center">
      <button type="button" @click="addItem" class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm">+ Add {{ label }}</button>
    </div>
  </div>
</template>
