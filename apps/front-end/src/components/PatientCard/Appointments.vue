<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@/assets';
import type { Appointment } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  appointment: Appointment
}>()

const formattedDate = computed(() =>
  props.appointment.date instanceof Date
    ? props.appointment.date.toLocaleDateString()
    : new Date(props.appointment.date).toLocaleDateString()
)
</script>

<template>
  <article
    class="w-full bg-gray-200 rounded-xl p-4 shadow-md flex flex-col gap-3"
    role="region"
    :aria-label="`Vitals for ${appointment.date.toDateString()}`"
  >
    <header class="flex items-center justify-between text-gray-800 font-medium">
      <button>
        <ArrowLeftIcon />
      </button>
      <span class="text-sm">{{ formattedDate }}</span>
      <button>
        <ArrowRightIcon />
      </button>
    </header>

    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-900">
      <div>{{ appointment.o2 }}% SpO₂</div>
      <div>{{ appointment.hiv.toLocaleString() }} cp/mL</div>

      <div>{{ appointment.bp }} mmHg</div>
      <div class="font-medium">Notes:</div>

      <div>{{ appointment.temp }} F°</div>
    </div>

    <ul v-if="appointment.notes.length" class="mt-2 text-xs text-gray-700 list-disc list-inside">
      <li v-for="(n, i) in appointment.notes" :key="i">{{ n.notes }}</li>
    </ul>

    <footer v-if="appointment.doctor" class="mt-2 text-xs text-gray-500">
      Doctor: {{ appointment.doctor }}
    </footer>
  </article>
</template>
