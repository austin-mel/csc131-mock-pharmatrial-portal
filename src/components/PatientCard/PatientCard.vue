<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'
import { Appointments, Drawer, NewAppointment, ProgressBar } from '@/components'
import { CheckIcon, CloseIcon, EditIcon, RejectIcon, SaveIcon, UserIcon } from '@/assets'
import type { PatientInformation } from '@/types'
import PlusIcon from '@/assets/icons/PlusIcon.vue';

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
  if (!val) revertEdits()
})

const editablePatient = reactive({
  nameFirst: props.patient?.name.first || '',
  nameLast: props.patient?.name.last || '',
  dob: props.patient?.dob
    ? formatDateForInput(props.patient.dob)
    : new Date().toISOString().substring(0, 10),
  address: props.patient?.address || '',
  insurance_num: props.patient?.insurance_num || '',
  height: props.patient?.height || 0,
  weight: props.patient?.weight || 0,
  blood: props.patient?.blood || ''
})

// Helper function to format a Date to "YYYY-MM-DD"
function formatDateForInput(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function saveChanges() {
  if (!props.patient) return
  props.patient.name.first = editablePatient.nameFirst
  props.patient.name.last = editablePatient.nameLast

  const [year, month, day] = editablePatient.dob.split('-').map(Number)
  props.patient.dob = new Date(year, month - 1, day)

  props.patient.address = editablePatient.address
  props.patient.insurance_num = editablePatient.insurance_num
  props.patient.height = editablePatient.height
  props.patient.weight = editablePatient.weight
  props.patient.blood = editablePatient.blood

  props.patient.allergies = props.patient.allergies.filter(a => a.name || a.reactions)
  props.patient.medications = props.patient.medications.filter(m => m.name || m.purpose)
  props.patient.history = props.patient.history.filter(h => h.disease || h.carrier)
  props.patient.icdcodes = props.patient.icdcodes.filter(i => i.code)

  isEditing.value = false
}


function revertEdits() {
  if (!props.patient) return

  editablePatient.nameFirst = props.patient.name.first
  editablePatient.nameLast = props.patient.name.last
  editablePatient.dob = formatDateForInput(props.patient.dob)
  editablePatient.address = props.patient.address
  editablePatient.insurance_num = props.patient.insurance_num
  editablePatient.height = props.patient.height
  editablePatient.weight = props.patient.weight
  editablePatient.blood = props.patient.blood

  props.patient.allergies = props.patient.allergies.filter(a => a.name || a.reactions)
  props.patient.medications = props.patient.medications.filter(m => m.name || m.purpose)
  props.patient.history = props.patient.history.filter(h => h.disease || h.carrier)
  props.patient.icdcodes = props.patient.icdcodes.filter(i => i.code)

  isEditing.value = false
}


function toggleEdit() {
  isEditing.value ? revertEdits() : (revertEdits(), isEditing.value = true)
}

function close() {
  showModal.value = false
  isAddingAppointment.value = false
}

const displayObjects = <T>(list: T[] | null | undefined, formatter: (item: T) => string): string =>
  list && list.length ? list.map(formatter).join(', ') : ' - '

const formattedDate = computed(() => {
  if (!props.patient?.dob) return ''
  const d = props.patient.dob instanceof Date ? props.patient.dob : new Date(props.patient.dob)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}/${day}/${year}`
})

const currentAppointmentPage = ref(1)

const appointmentsPerPage = 1

const paginatedAppointments = computed(() => {
  if (!props.patient?.appointments) return []
  const start = (currentAppointmentPage.value - 1) * appointmentsPerPage
  return props.patient.appointments.slice(start, start + appointmentsPerPage)
})

const totalAppointmentPages = computed(() => {
  return props.patient?.appointments
    ? Math.ceil(props.patient.appointments.length / appointmentsPerPage)
    : 1
})

function changeAppointmentPage(page: number) {
  if (page < 1 || page > totalAppointmentPages.value) return
  currentAppointmentPage.value = page
}

const isAddingAppointment = ref(false)

const newAppointment = reactive({
  date: '',
  doctor: '',
  bp: '',
  temp: '',
  o2: '',
  hiv: '',
  notes: ''
})

function toggleNewAppointment() {
  isAddingAppointment.value = !isAddingAppointment.value
}

function saveAppointment() {
  if (!props.patient) return

  const appt = {
    date: new Date(newAppointment.date),
    doctor: newAppointment.doctor,
    bp: newAppointment.bp,
    temp: Number(newAppointment.temp),
    o2: Number(newAppointment.o2),
    hiv: Number(newAppointment.hiv),
    notes: newAppointment.notes
      ? [{ notes: newAppointment.notes }]
      : []
  }

  props.patient.appointments.push(appt)

  Object.assign(newAppointment, {
    date: '',
    doctor: '',
    bp: '',
    temp: '',
    o2: '',
    hiv: '',
    notes: ''
  })
  isAddingAppointment.value = false
}

const isFormEmpty = computed(() => {
  return !newAppointment.date ||
    !newAppointment.doctor ||
    !newAppointment.bp ||
    !newAppointment.temp ||
    !newAppointment.o2 ||
    !newAppointment.hiv
})
</script>

<template>
  <Drawer v-model="showModal" role="dialog" @closed="isAddingAppointment = false">
    <div v-if="props.patient" class="m-4 relative focus:outline-none max-h-[calc(100vh-12rem)] overflow-y-auto">

      <div class="flex gap-4 mb-4 w-full" :class="isEditing ? 'justify-center' : 'justify-start'">
        <UserIcon class="w-16 h-auto" />
        <div class="w-[24rem] flex flex-col">
          <template v-if="!isEditing">
            <p class="font-semibold text-3xl ">{{ props.patient.name.first }} {{ props.patient.name.last }}</p>
            <p class="text-xl text-gray-600">{{ formattedDate }}</p>
          </template>
          <template v-else>
            <div class="relative group">
              <input v-model="editablePatient.nameFirst" class="border p-1 rounded w-full mb-1"
                placeholder="First Name" />
              <span
                class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
                first name</span>
            </div>
            <div class="relative group">
              <input v-model="editablePatient.nameLast" class="border p-1 rounded w-full mb-1"
                placeholder="Last Name" />
              <span
                class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
                last name</span>
            </div>
            <div class="relative group">
              <input v-model="editablePatient.dob" type="date" class="border p-1 rounded w-full" />
              <span
                class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                Enter date of birth
              </span>
            </div>
          </template>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="my-3 text-xl grid grid-cols-2 gap-4 text-center">
        <template v-if="!isEditing">
          <p>{{ props.patient.address }}</p>
          <p>{{ props.patient.insurance_num }}</p>
        </template>
        <template v-else>
          <div class="relative group">
            <input v-model="editablePatient.address" class="border p-1 rounded w-full" placeholder="Address" />
            <span
              class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
              address</span>
          </div>
          <div class="relative group">
            <input v-model="editablePatient.insurance_num" class="border p-1 rounded w-full"
              placeholder="Insurance #" />
            <span
              class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
              insurance number</span>
          </div>
        </template>
      </div>

      <div class="grid grid-cols-3 gap-4 text-xl text-center">
        <template v-if="!isEditing">
          <p>{{ props.patient.height }} in</p>
          <p>{{ props.patient.weight }} lbs</p>
          <p>{{ props.patient.blood }}</p>
        </template>
        <template v-else>
          <div class="relative group">
            <input v-model.number="editablePatient.height" type="number" class="border p-1 rounded w-full"
              placeholder="Height" />
            <span
              class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
              height in inches</span>
          </div>
          <div class="relative group">
            <input v-model.number="editablePatient.weight" type="number" class="border p-1 rounded w-full"
              placeholder="Weight" />
            <span
              class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
              weight in pounds</span>
          </div>
          <div class="relative group">
            <input v-model="editablePatient.blood" class="border p-1 rounded w-full" placeholder="Blood Type" />
            <span
              class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">Enter
              blood type</span>
          </div>
        </template>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="my-3 text-xl grid grid-cols-2 text-center gap-4">
        <div>
          <span class="font-medium block mb-1">Employed?</span>
          <template v-if="!isEditing">
            <component :is="props.patient.employed ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
              :class="props.patient.employed ? 'text-green-600' : 'text-red-600'" />
          </template>
          <template v-else>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="props.patient.employed" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
              <div
                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5">
              </div>
            </label>
          </template>
        </div>

        <div>
          <span class="font-medium block mb-1">Insured?</span>
          <template v-if="!isEditing">
            <component :is="props.patient.insured ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
              :class="props.patient.insured ? 'text-green-600' : 'text-red-600'" />
          </template>
          <template v-else>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="props.patient.insured" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
              <div
                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5">
              </div>
            </label>
          </template>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="space-y-4 text-xl">

        <!-- Allergies -->
        <div v-if="!isEditing">
          <strong>Allergies:</strong>
          {{displayObjects(props.patient.allergies, a => `${a.name} (${a.reactions})`)}}
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <strong class="text-left block">Allergies:</strong>
            <div v-for="(a, idx) in props.patient.allergies" :key="idx" class="flex gap-2 mb-1">
              <div class="relative group w-full">
                <input v-model="a.name" class="border p-1 rounded w-full" placeholder="Allergy Name" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter allergy name
                </span>
              </div>
              <div class="relative group w-full">
                <input v-model="a.reactions" class="border p-1 rounded w-full" placeholder="Reactions" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter reactions
                </span>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="button" @click="props.patient.allergies.push({ name: '', reactions: '' })"
                class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm">
                + Add Allergy
              </button>
            </div>
          </div>
        </div>

        <!-- Medications -->
        <div v-if="!isEditing">
          <strong>Medications:</strong>
          {{displayObjects(props.patient.medications, m => `${m.name} (${m.purpose})`)}}
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <strong class="text-left block">Medications:</strong>
            <div v-for="(m, idx) in props.patient.medications" :key="idx" class="flex gap-2 mb-1">
              <div class="relative group w-full">
                <input v-model="m.name" class="border p-1 rounded w-full" placeholder="Medication" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter medication name
                </span>
              </div>
              <div class="relative group w-full">
                <input v-model="m.purpose" class="border p-1 rounded w-full" placeholder="Purpose" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter purpose
                </span>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="button" @click="props.patient.medications.push({ name: '', purpose: '' })"
                class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm">
                + Add Medication
              </button>
            </div>
          </div>
        </div>

        <!-- History -->
        <div v-if="!isEditing">
          <strong>History:</strong>
          {{displayObjects(props.patient.history, h => `${h.disease} (Carrier: ${h.carrier})`)}}
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <strong class="text-left block">History:</strong>
            <div v-for="(h, idx) in props.patient.history" :key="idx" class="flex gap-2 mb-1">
              <div class="relative group w-full">
                <input v-model="h.disease" class="border p-1 rounded w-full" placeholder="Disease" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter disease
                </span>
              </div>
              <div class="relative group w-full">
                <input v-model="h.carrier" class="border p-1 rounded w-full" placeholder="Carrier" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter carrier
                </span>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="button" @click="props.patient.history.push({ disease: '', carrier: '' })"
                class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm">
                + Add History
              </button>
            </div>
          </div>
        </div>

        <!-- ICD Codes -->
        <div v-if="!isEditing">
          <strong>ICD Codes:</strong>
          {{displayObjects(props.patient.icdcodes, i => i.code)}}
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <strong class="text-left block">ICD Codes:</strong>
            <div v-for="(i, idx) in props.patient.icdcodes" :key="idx" class="flex gap-2 mb-1">
              <div class="relative group w-full">
                <input v-model="i.code" class="border p-1 rounded w-full" placeholder="Code" />
                <span
                  class="absolute left-0 -top-6 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  Enter ICD code
                </span>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="button" @click="props.patient.icdcodes.push({ code: '' })"
                class="px-2 py-1 mt-1 border rounded hover:bg-gray-200 text-sm">
                + Add ICD Code
              </button>
            </div>
          </div>
        </div>
      </div>


      <hr class="my-3 border-gray-300" />
      <p><strong>Dose:</strong></p>
      <ProgressBar :currentStep=props.patient.dose />

      <hr class="mt-8 mb-3 border-gray-300" />

      <div class="flex justify-center mb-3">
        <button v-if="!isAddingAppointment" @click="toggleNewAppointment"
          class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
          <PlusIcon class="w-6 h-6 pr-2" />
          New Appointment
        </button>

        <div v-else class="w-full bg-gray-200 p-4 rounded-lg shadow">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="newAppointment.date" type="date" class="border p-2 rounded w-full" />
            <input v-model="newAppointment.doctor" type="text" placeholder="Doctor" class="border p-2 rounded w-full" />
            <input v-model="newAppointment.bp" type="text" placeholder="BP" class="border p-2 rounded w-full" />
            <input v-model="newAppointment.temp" type="number" placeholder="Temp (°F)"
              class="border p-2 rounded w-full" />
            <input v-model="newAppointment.o2" type="number" placeholder="O₂ %" class="border p-2 rounded w-full" />
            <input v-model="newAppointment.hiv" type="number" placeholder="HIV cp/mL"
              class="border p-2 rounded w-full" />
          </div>

          <textarea v-model="newAppointment.notes" class="border p-2 rounded w-full mt-3"
            placeholder="Notes"></textarea>

          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="saveAppointment" :disabled="isFormEmpty"
              class="relative flex items-center px-3 py-1 border rounded"
              :class="isFormEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-300'">
              <SaveIcon class="w-6 h-6 pr-2" />
              Save
            </button>

            <button type="button" @click="toggleNewAppointment"
              class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
              <CloseIcon class="w-6 h-6 pr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-2 mb-3" v-if="props.patient?.appointments?.length && !isAddingAppointment">
        <Appointments :appointment="paginatedAppointments[0]" :currentPage="currentAppointmentPage"
          :totalPages="totalAppointmentPages" @prev="changeAppointmentPage(currentAppointmentPage - 1)"
          @next="changeAppointmentPage(currentAppointmentPage + 1)" />
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-300 p-4 flex justify-between z-10">
        <button type="button" @click="toggleEdit"
          class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300">
          <component :is="isEditing ? CloseIcon : EditIcon" class="w-6 h-6 pr-2" />
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>

        <button type="button" @click="isEditing ? saveChanges() : close()"
          class="relative flex items-center px-3 py-1 border rounded hover:bg-stone-300"
          :aria-label="isEditing ? 'Save patient changes' : 'Close patient details'">
          <component :is="isEditing ? SaveIcon : CloseIcon" class="w-6 h-6 pr-2" />
          {{ isEditing ? 'Save' : 'Close' }}
        </button>
      </div>

    </div>
  </Drawer>
</template>
