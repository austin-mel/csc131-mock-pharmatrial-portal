<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { Appointment } from '@/types'
import { CloseIcon, SaveIcon } from '@/assets'

const emit = defineEmits<{
  (e: 'save', appt: Appointment): void
  (e: 'cancel'): void
}>()

const form = reactive({
  date: '',
  doctor: '',
  bp: '',
  temp: '' as number | '',
  o2: '' as number | '',
  hiv: '' as number | '',
  notes: [''] as string[]
})

const isFormInvalid = computed(() => {
  return (
    !form.date ||
    !form.doctor ||
    !form.bp ||
    form.temp === '' ||
    form.o2 === '' ||
    form.hiv === ''
  )
})

function onSubmit() {
  const appt: Appointment = {
    date: new Date(form.date),
    doctor: form.doctor,
    bp: form.bp,
    temp: Number(form.temp),
    o2: Number(form.o2),
    hiv: Number(form.hiv),
    notes: form.notes
      .filter(n => n.trim())
      .map(n => ({ notes: n }))
  }
  emit('save', appt)
  reset()
}

function reset() {
  form.date = ''
  form.doctor = ''
  form.bp = ''
  form.temp = ''
  form.o2 = ''
  form.hiv = ''
  form.notes = ['']
}

function onCancel() {
  reset()
  emit('cancel')
}
</script>

<template>
  <div class="w-full bg-gray-100 p-4 rounded-lg shadow">
    <h3 class="text-lg font-medium mb-3">New Appointment</h3>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.date" type="date" required class="border p-2 rounded w-full" />
        <input v-model="form.doctor" type="text" placeholder="Doctor" required class="border p-2 rounded w-full" />
        <input v-model="form.bp" type="text" placeholder="BP" required class="border p-2 rounded w-full" />
        <input v-model.number="form.temp" type="number" placeholder="Temp (°F)" required class="border p-2 rounded w-full" />
        <input v-model.number="form.o2" type="number" placeholder="O₂ %" required class="border p-2 rounded w-full" />
        <input v-model.number="form.hiv" type="number" placeholder="HIV cp/mL" required class="border p-2 rounded w-full" />
      </div>

<div>
  <strong class="block mb-2">Notes:</strong>
  <div v-for="(note, idx) in form.notes" :key="idx" class="mb-2">
    <textarea
      v-model="form.notes[idx]"
      placeholder="Notes"
      class="border p-2 rounded w-full"
    />
  </div>
  <button
    type="button"
    @click="form.notes.push('')"
    class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm"
  >
    + Add Note
  </button>
</div>

      <div class="flex justify-end gap-3 mt-4">
        <button type="button" @click="onCancel" class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
          <CloseIcon class="w-6 h-6 pr-2" /> Cancel
        </button>
        <button type="submit" :disabled="isFormInvalid" class="relative flex items-center px-3 py-1 border rounded" :class="isFormInvalid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-300'">
          <SaveIcon class="w-6 h-6 pr-2" /> Save
        </button>
      </div>
    </form>
  </div>
</template>
