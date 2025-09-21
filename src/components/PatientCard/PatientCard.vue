<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { Appointments, Drawer, NewAppointment } from '@/components'
import { CheckIcon, CloseIcon, EditIcon, RejectIcon, SaveIcon, UserIcon } from '@/assets'
import type { PatientInformation } from '@/types'

const props = defineProps<{
  patient: PatientInformation | null
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const showModal = ref(props.modelValue)
const isEditing = ref(false)

const editablePatient = reactive({
  nameFirst: props.patient?.name.first || '',
  nameLast: props.patient?.name.last || '',
  dob: props.patient?.dob || '',
  address: props.patient?.address || '',
  insurance_num: props.patient?.insurance_num || '',
  height: props.patient?.height || 0,
  weight: props.patient?.weight || 0,
  blood: props.patient?.blood || ''
})

watch(() => props.modelValue, val => (showModal.value = val))
watch(showModal, val => {
  emit('update:modelValue', val)
  if (!val) revertEdits()
})

function revertEdits() {
  if (!props.patient) return
  editablePatient.nameFirst = props.patient.name.first
  editablePatient.nameLast = props.patient.name.last
  editablePatient.dob = props.patient.dob
  editablePatient.address = props.patient.address
  editablePatient.insurance_num = props.patient.insurance_num
  editablePatient.height = props.patient.height
  editablePatient.weight = props.patient.weight
  editablePatient.blood = props.patient.blood
  isEditing.value = false
}

function toggleEdit() {
  isEditing.value ? revertEdits() : (revertEdits(), isEditing.value = true)
}

function saveChanges() {
  if (!props.patient) return
  props.patient.name.first = editablePatient.nameFirst
  props.patient.name.last = editablePatient.nameLast
  props.patient.dob = new Date(editablePatient.dob)
  props.patient.address = editablePatient.address
  props.patient.insurance_num = editablePatient.insurance_num
  props.patient.height = editablePatient.height
  props.patient.weight = editablePatient.weight
  props.patient.blood = editablePatient.blood
  isEditing.value = false
}

function close() {
  showModal.value = false
}

const displayObjects = <T>(list: T[] | null | undefined, formatter: (item: T) => string): string =>
  list && list.length ? list.map(formatter).join(', ') : 'None'
</script>

<template>
  <Drawer v-model="showModal" role="dialog" aria-modal="true" aria-label="Patient details">
    <div v-if="props.patient" class="m-4 relative focus:outline-none">

      <div class="flex items-center gap-4 mb-4">
        <UserIcon class="w-16 h-auto" />
        <div>
          <template v-if="!isEditing">
            <p class="font-semibold text-lg">{{ props.patient.name.first }} {{ props.patient.name.last }}</p>
            <p class="text-sm text-gray-600">{{ props.patient.dob }}</p>
          </template>
          <template v-else>
            <div class="relative group">
              <input v-model="editablePatient.nameFirst" class="border p-1 rounded w-full mb-1" placeholder="First Name" />
              <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter first name</span>
            </div>
            <div class="relative group">
              <input v-model="editablePatient.nameLast" class="border p-1 rounded w-full mb-1" placeholder="Last Name" />
              <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter last name</span>
            </div>
            <div class="relative group">
              <input v-model="editablePatient.dob" class="border p-1 rounded w-full" placeholder="DOB" />
              <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter date of birth</span>
            </div>
          </template>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="my-3 text-sm grid grid-cols-2 gap-4 text-center">
        <template v-if="!isEditing">
          <p>{{ props.patient.address }}</p>
          <p>{{ props.patient.insurance_num }}</p>
        </template>
        <template v-else>
          <div class="relative group">
            <input v-model="editablePatient.address" class="border p-1 rounded w-full" placeholder="Address" />
            <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter address</span>
          </div>
          <div class="relative group">
            <input v-model="editablePatient.insurance_num" class="border p-1 rounded w-full" placeholder="Insurance #" />
            <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter insurance number</span>
          </div>
        </template>
      </div>

      <div class="grid grid-cols-3 gap-4 text-sm text-center">
        <template v-if="!isEditing">
          <p>{{ props.patient.height }} in</p>
          <p>{{ props.patient.weight }} lbs</p>
          <p>{{ props.patient.blood }}</p>
        </template>
        <template v-else>
          <div class="relative group">
            <input v-model.number="editablePatient.height" type="number" class="border p-1 rounded w-full" placeholder="Height" />
            <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter height in inches</span>
          </div>
          <div class="relative group">
            <input v-model.number="editablePatient.weight" type="number" class="border p-1 rounded w-full" placeholder="Weight" />
            <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter weight in pounds</span>
          </div>
          <div class="relative group">
            <input v-model="editablePatient.blood" class="border p-1 rounded w-full" placeholder="Blood Type" />
            <span class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter blood type</span>
          </div>
        </template>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="my-3 text-sm grid grid-cols-2 text-center gap-4">
        <div>
          <span class="font-medium block mb-1">Employed?</span>
          <component :is="props.patient.employed ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto" :class="props.patient.employed ? 'text-green-600' : 'text-red-600'" aria-hidden="true" />
          <span class="sr-only">{{ props.patient.employed ? 'Employed' : 'Not employed' }}</span>
        </div>
        <div>
          <span class="font-medium block mb-1">Insured?</span>
          <component :is="props.patient.insured ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto" :class="props.patient.insured ? 'text-green-600' : 'text-red-600'" aria-hidden="true" />
          <span class="sr-only">{{ props.patient.insured ? 'Insured' : 'Not insured' }}</span>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="space-y-1 text-sm">
        <p><strong>Allergies:</strong> {{ displayObjects(props.patient.allergies, a => `${a.name} (${a.reactions})`) }}</p>
        <p><strong>Medications:</strong> {{ displayObjects(props.patient.medications, m => `${m.name} (${m.purpose})`) }}</p>
        <p><strong>History:</strong> {{ displayObjects(props.patient.history, h => `${h.disease} (Carrier: ${h.carrier})`) }}</p>
        <p><strong>ICD Codes:</strong> {{ displayObjects(props.patient.icdcodes, i => i.code) }}</p>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="flex justify-center mb-3">
        <NewAppointment />
      </div>

      <div class="flex flex-col gap-2 mb-3">
        <Appointments v-if="props.patient.appointments?.length" :appointment="props.patient.appointments[0]" />
      </div>

      <div class="flex justify-between">
        <button type="button" @click="toggleEdit" class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
          <component :is="isEditing ? CloseIcon : EditIcon" class="w-6 h-6 pr-2" />{{ isEditing ? 'Cancel' : 'Edit' }}
        </button>
        <button type="button" @click="isEditing ? saveChanges() : close()" class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300" :aria-label="isEditing ? 'Save patient changes' : 'Close patient details'">
          <component :is="isEditing ? SaveIcon : CloseIcon" class="w-6 h-6 pr-2" />{{ isEditing ? 'Save' : 'Close' }}
        </button>
      </div>

    </div>
  </Drawer>
</template>
