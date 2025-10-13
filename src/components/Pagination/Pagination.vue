<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  itemsPerPage?: number
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', page: number): void
}>()

const itemsPerPage = computed(() => props.itemsPerPage ?? 15)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / itemsPerPage.value))
)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('update:modelValue', page)
}

const pagesToShow = computed(() => {
  const current = props.modelValue
  const delta = 2
  const range: number[] = []

  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(totalPages.value, current + delta);
    i++
  ) {
    range.push(i)
  }
  return range
})
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 my-4" role="navigation"
    aria-label="Pagination">
    <button @click="goToPage(props.modelValue - 1)" :disabled="props.modelValue === 1"
      class="px-3 py-1 border rounded disabled:opacity-50">
      Prev
    </button>

    <button v-for="page in pagesToShow" :key="page" @click="goToPage(page)" :class="[
      'px-3 py-1 border rounded',
      props.modelValue === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
    ]">
      {{ page }}
    </button>

    <button @click="goToPage(props.modelValue + 1)" :disabled="props.modelValue === totalPages"
      class="px-3 py-1 border rounded disabled:opacity-50">
      Next
    </button>
  </nav>
</template>
