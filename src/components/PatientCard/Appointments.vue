<script setup lang="ts">
import type { Appointment } from '@/types'
import { computed } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from '@/assets'

const props = defineProps<{
  appointment: Appointment
  currentPage: number
  totalPages: number
}>()

const formattedDate = computed(() => {
  const d = props.appointment?.date instanceof Date ? props.appointment.date : new Date(props.appointment?.date)
  return d.toLocaleDateString()
})
</script>

<template>
  <div class="w-full bg-gray-200 rounded-xl p-4 shadow-md flex flex-col gap-3">
    <header class="flex items-center justify-between text-gray-800 font-medium">
      <button v-if="currentPage > 1" @click="$emit('prev')" class="p-1">
        <ArrowLeftIcon />
      </button>
      <div class="text-xl">{{ formattedDate }}</div>
      <button v-if="currentPage < totalPages" @click="$emit('next')" class="p-1">
        <ArrowRightIcon />
      </button>
    </header>

    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-lg text-gray-900">
      <div>{{ appointment.o2 }}% SpO₂</div>
      <div>{{ appointment.hiv.toLocaleString() }} cp/mL</div>
      <div>{{ appointment.bp }} mmHg</div>
      <div>{{ appointment.temp }} F°</div>
    </div>

    <div class="font-medium text-lg">Notes:</div>
    <ul v-if="appointment.notes?.length" class="mt-2 text-gray-700 list-disc list-inside">
      <li v-for="(n, i) in appointment.notes" :key="i">{{ n.notes }}</li>
    </ul>

    <footer v-if="appointment.doctor" class="mt-2 text-xs text-gray-500">
      Doctor: {{ appointment.doctor }}
    </footer>

    <div class="flex justify-end text-gray-600">
      ({{ currentPage }} / {{ totalPages }})
    </div>
  </div>
</template>
