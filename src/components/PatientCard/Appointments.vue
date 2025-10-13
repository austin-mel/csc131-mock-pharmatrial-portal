<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@/assets';
import type { Appointment } from '@/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  appointment: Appointment
  currentPage: number
  totalPages: number
}>()

const formattedDate = computed(() =>
  props.appointment.date instanceof Date
    ? props.appointment.date.toLocaleDateString()
    : new Date(props.appointment.date).toLocaleDateString()
)

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="container mx-auto p-4">
      <article
    class="w-full bg-gray-200 rounded-xl p-4 shadow-md flex flex-col gap-3"
  >
    <header class="flex items-center justify-between text-gray-800 font-medium">
        <button v-if="props.currentPage > 1" @click="emit('prev')">
          <ArrowLeftIcon class="cursor-pointer" />
        </button>
        <div v-else class="w-6"></div>

        <span class="text-xl">
          {{ formattedDate }}
        </span>

        <button v-if="props.currentPage < props.totalPages" @click="emit('next')">
          <ArrowRightIcon class="cursor-pointer" />
        </button>
        <div v-else class="w-6"></div>
    </header>

    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-lg text-gray-900">
      <div>{{ appointment.o2 }}% SpO₂</div>
      <div>{{ appointment.hiv.toLocaleString() }} cp/mL</div>

      <div>{{ appointment.bp }} mmHg</div>
      <div>{{ appointment.temp }} F°</div>
    </div>

    <div class="font-medium text-lg">Notes:</div>
    <ul v-if="appointment.notes.length" class="mt-2 text- text-gray-700 list-disc list-inside">
      <li v-for="(n, i) in appointment.notes" :key="i">{{ n.notes }}</li>
    </ul>

    <footer v-if="appointment.doctor" class="mt-2 text-xs text-gray-500">
      Doctor: {{ appointment.doctor }}
    </footer>

    <div class="flex justify-end">
                <span class="text-gray-600">
            ({{ props.currentPage }} / {{ props.totalPages }})
          </span>
    </div>
  </article>

  
  </div>
</template>
