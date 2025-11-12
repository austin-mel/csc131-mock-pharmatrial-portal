<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PatientInformation, Appointment } from '@/types'
import { Drawer, Appointments, EditPatientCard, NewAppointmentForm, ProgressBar } from '@/components'
import PlusIcon from '@/assets/icons/PlusIcon.vue'
import { CheckIcon, CloseIcon, EditIcon, RejectIcon, SaveIcon, UserIcon } from '@/assets'

const props = defineProps<{
  patient: PatientInformation | null
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const showModal = ref(props.modelValue)
const isEditing = ref(false)

watch(() => props.modelValue, val => (showModal.value = val))
watch(showModal, val => {
  emit('update:modelValue', val)
  if (!val) {
    isEditing.value = false
    isAddingAppointment.value = false
  }
})

function onToggleEdit() {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
  }
}

function onSaveEdit(updated: PatientInformation) {
  if (!props.patient) return
  Object.assign(props.patient, updated)
  isEditing.value = false
}

function onCancelEdit() {
  isEditing.value = false
}

function onClose() {
  showModal.value = false
}

function onDrawerClosed() {
  isAddingAppointment.value = false
}

const displayObjects = <T,>(list: T[] | null | undefined, formatter: (item: T) => string) =>
  list && list.length ? list.map(formatter).join(', ') : ' - '

const currentAppointmentPage = ref(1)
const appointmentsPerPage = 1
const isAddingAppointment = ref(false)

const newAppointment = ref({
  date: '',
  doctor: '',
  bp: '',
  temp: '',
  o2: '',
  hiv: '',
  notes: ''
})

const paginatedAppointments = computed(() => {
  if (!props.patient?.appointments) return []
  const start = (currentAppointmentPage.value - 1) * appointmentsPerPage
  return props.patient.appointments.slice(start, start + appointmentsPerPage)
})

const totalAppointmentPages = computed(() => {
  return props.patient?.appointments ? Math.max(1, Math.ceil(props.patient.appointments.length / appointmentsPerPage)) : 1
})

function changeAppointmentPage(page: number) {
  if (page < 1 || page > totalAppointmentPages.value) return
  currentAppointmentPage.value = page
}

function onSaveAppointment(appt: Appointment) {
  if (!props.patient) return
  props.patient.appointments.push(appt)
  Object.assign(newAppointment.value, { date: '', doctor: '', bp: '', temp: '', o2: '', hiv: '', notes: '' })
  isAddingAppointment.value = false
  currentAppointmentPage.value = totalAppointmentPages.value
}

function onCancelNewAppointment() {
  isAddingAppointment.value = false
  Object.assign(newAppointment.value, { date: '', doctor: '', bp: '', temp: '', o2: '', hiv: '', notes: '' })
}

const formattedDate = computed(() => {
  if (!props.patient?.dob) return ''
  const d = props.patient.dob instanceof Date ? props.patient.dob : new Date(props.patient.dob)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
})

const editRef = ref()
</script>

<template>
  <Drawer v-model="showModal" role="dialog" @closed="onDrawerClosed">
    <div v-if="patient" class="m-4 relative focus:outline-none max-h-[calc(100vh-12rem)] overflow-y-auto">
      <div :class="isEditing ? 'justify-center' : 'justify-start'" class="flex gap-4 mb-4 w-full">
        <UserIcon v-if="!isEditing" class="w-16 h-auto" />
        <div class="w-[24rem] flex flex-col">
          <template v-if="!isEditing">
            <p class="font-semibold text-3xl">{{ patient.name.first }} {{ patient.name.last }}</p>
            <p class="text-xl text-gray-600">{{ formattedDate }}</p>
          </template>

          <template v-else>
            <EditPatientCard
              ref="editRef"
              :patient="patient"
              @save="onSaveEdit"
              @cancel="onCancelEdit"
            />
          </template>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div v-if="!isEditing" class="space-y-4">
        <div class="my-3 text-xl grid grid-cols-2 gap-4 text-center">
          <p>{{ patient.address }}</p>
          <p>{{ patient.insurance_num }}</p>
        </div>

        <div class="grid grid-cols-3 gap-4 text-xl text-center">
          <p>{{ patient.height }} in</p>
          <p>{{ patient.weight }} lbs</p>
          <p>{{ patient.blood }}</p>
        </div>

        <hr class="my-3 border-gray-300" />

        <div class="my-3 text-xl grid grid-cols-2 text-center gap-4">
          <div>
            <span class="font-medium block mb-1">Employed?</span>
            <component :is="patient.employed ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
              :class="patient.employed ? 'text-green-600' : 'text-red-600'" />
          </div>

          <div>
            <span class="font-medium block mb-1">Insured?</span>
            <component :is="patient.insured ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
              :class="patient.insured ? 'text-green-600' : 'text-red-600'" />
          </div>
        </div>

        <hr class="my-3 border-gray-300" />

        <div class="space-y-4 text-xl">
          <div>
            <strong>Allergies:</strong>
            {{ displayObjects(patient.allergies, a => `${a.name} (${a.reactions})`) }}
          </div>

          <div>
            <strong>Medications:</strong>
            {{ displayObjects(patient.medications, m => `${m.name} (${m.purpose})`) }}
          </div>

          <div>
            <strong>History:</strong>
            {{ displayObjects(patient.history, h => `${h.disease} (Carrier: ${h.carrier})`) }}
          </div>

          <div>
            <strong>ICD Codes:</strong>
            {{ displayObjects(patient.icdcodes, i => i.code) }}
          </div>
        </div>

        <hr class="my-3 border-gray-300" />

        <p><strong>Dose:</strong></p>
        <ProgressBar :currentStep="patient.dose" />

        <hr class="mt-8 mb-3 border-gray-300" />

        <div class="flex justify-center mb-3">
          <button v-if="!isAddingAppointment" @click="isAddingAppointment = true"
            class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
            <PlusIcon class="w-6 h-6 pr-2" />
            New Appointment
          </button>

          <div v-else class="w-full bg-gray-200 p-4 rounded-lg shadow">
            <NewAppointmentForm
              v-model:form="newAppointment"
              @save="onSaveAppointment"
              @cancel="onCancelNewAppointment"
            />
          </div>
        </div>

        <div class="flex justify-center gap-2 mb-3" v-if="patient.appointments && patient.appointments.length && !isAddingAppointment">
          <Appointments
            :appointment="paginatedAppointments[0]"
            :currentPage="currentAppointmentPage"
            :totalPages="totalAppointmentPages"
            @prev="changeAppointmentPage(currentAppointmentPage - 1)"
            @next="changeAppointmentPage(currentAppointmentPage + 1)"
          />
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-300 p-4 flex justify-between z-10">
  <button
  v-if="!isEditing"
  type="button"
  @click="onToggleEdit"
  class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300"
>
  <EditIcon class="w-6 h-6 pr-2" /> Edit
</button>
  <button
  v-if="!isEditing"
  type="button"
  @click="onClose"
  class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300"
>
  <CloseIcon class="w-6 h-6 pr-2" /> Close
</button>

  <button
  v-if="isEditing"
  type="button"
  @click="editRef?.onCancel()"
  class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300"
>
  <CloseIcon class="w-6 h-6 pr-2" /> Cancel
</button>

<button
  v-if="isEditing"
  type="button"
  @click="editRef?.onSave()"
  class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300"
>
  <SaveIcon class="w-6 h-6 pr-2" /> Save
</button>
      </div>
    </div>
  </Drawer>
</template>
