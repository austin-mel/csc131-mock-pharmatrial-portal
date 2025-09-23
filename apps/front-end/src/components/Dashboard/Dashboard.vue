<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Sidebar, NewStudy, SortTabs, StudyTable, PatientTable, PatientCard } from '@/components'
import { useAuthStore } from '@/stores'
import type { Appointment, Trial, PatientInformation } from '@/types'

const auth = useAuthStore()
const activeTab = ref('all')

const showPatientTable = ref(false)
const selectedTrial = ref<Trial | null>(null)
const selectedPatient = ref<PatientInformation | null>(null)
const showPatientModal = ref(false)

function handleViewTrial(trial: Trial) {
  console.log('Viewing trial:', trial)
  selectedTrial.value = trial
  showPatientTable.value = true
}

function handleViewPatient(patient: PatientInformation) {
  console.log('Viewing patient:', patient)
  selectedPatient.value = patient
  showPatientModal.value = true
}

function resetView() {
  console.log('Dashboard: resetView called — switching to StudyTable and resetting tabs')
  selectedTrial.value = null
  selectedPatient.value = null
  showPatientTable.value = false
  activeTab.value = 'all'
}

watch(
  () => auth.accountType,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('Dashboard: auth.accountType changed:', oldVal, '->', newVal)
      resetView()
    }
  }
)

const filteredPatients = computed(() => {
  if (!selectedTrial.value) return []
  return patients.value.filter(p => p.study_id === selectedTrial.value?.id)
})

const sampleAppointments: Appointment[] = [
  {
    date: new Date('2025-09-01T10:00:00Z'),
    o2: 97,
    bp: '120/80',
    temp: 98.6,
    hiv: 0,
    notes: [],
    doctor: 'Dr. Smith'
  },
  {
    date: new Date('2025-09-15T14:30:00Z'),
    o2: 95,
    bp: '118/76',
    temp: 98.4,
    hiv: 1,
    notes: [{ notes: 'Patient reported mild headache.' }],
    doctor: 'Dr. Adams'
  }
]

const patients = ref<PatientInformation[]>([
  {
    name: { first: 'John', last: 'Doe' },
    id: 'p001',
    study_id: '001',
    drug_id: 'd001',
    contact: { phone_number: '123', email: 'john@example.com' },
    dob: '1990-01-01',
    address: '123 Main St',
    insurance_num: '123456789',
    height: 180,
    weight: 75,
    blood: 'O+',
    employed: true,
    insured: true,
    allergies: [],
    medications: [],
    history: [],
    icdcodes: [],
    eligibility: true,
    dose: 50,
    appointments: sampleAppointments,
  },
  {
    name: { first: 'Jane', last: 'Smith' },
    id: 'p002',
    study_id: '002',
    drug_id: 'd002',
    contact: { phone_number: '456', email: 'jane@example.com' },
    dob: '1985-06-10',
    address: '456 Park Ave',
    insurance_num: '987654321',
    height: 165,
    weight: 65,
    blood: 'A-',
    employed: false,
    insured: true,
    allergies: [],
    medications: [],
    history: [],
    icdcodes: [],
    eligibility: false,
    dose: 0,
    appointments: [],
  },
  {
  name: { first: 'Alice', last: 'Smith' },
  id: 'p002',
  study_id: '002',
  drug_id: 'd002',
  contact: { phone_number: '555-987-6543', email: 'alice.smith@example.com' },
  dob: '1985-07-14',
  address: '456 Oak Avenue',
  insurance_num: '987654321',
  height: 165,
  weight: 68,
  blood: 'A-',
  employed: false,
  insured: true,
  allergies: [
    { name: 'Peanuts', reactions: 'Anaphylaxis' },
    { name: 'Penicillin', reactions: 'Rash and swelling' }
  ],
  medications: [],
  history: [],
  icdcodes: [
    { code: 'J45' },
    { code: 'E11' } 
  ],
  eligibility: true,
  dose: 75,
  appointments: sampleAppointments
  }
])

const trials = ref<Trial[]>([
  {
    name: 'Trial A',
    id: '001',
    status: 'active',
    approvals: { fda: true, jh: true, bav: true },
    active: true,
    completed: false,
    rejected: false,
    drug_id: ''
  },
  {
    name: 'Trial B',
    id: '002',
    status: 'pending',
    approvals: { fda: false, jh: true, bav: true },
    active: false,
    completed: false,
    rejected: false,
    drug_id: ''
  },
  {
    name: 'Trial C',
    id: '003',
    status: 'completed',
    approvals: { fda: true, jh: true, bav: true },
    active: true,
    completed: true,
    rejected: false,
    drug_id: ''
  },
  {
    name: 'Trial D',
    id: '004',
    status: 'rejected',
    approvals: { fda: true, jh: true, bav: false },
    active: false,
    completed: false,
    rejected: true,
    drug_id: ''
  }
])
</script>

<template>
  <div class="flex">
    <Sidebar v-if="auth.isLoggedIn" @reset-view="resetView" />

    <div class="bg-white w-screen rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] sm:h-[100vh] shadow p-4">
<div
  class="flex items-center mb-4"
  :class="showPatientTable ? 'justify-center' : 'justify-between'"
>
  <NewStudy v-if="!showPatientTable" />
  <SortTabs v-if="!showPatientTable" v-model:activeTab="activeTab" />

  <button
    v-if="showPatientTable"
    @click="resetView"
    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Back to Studies
  </button>
</div>

      <div class="flex">
        <PatientTable
          v-if="showPatientTable"
          :patients="filteredPatients"
          @view="handleViewPatient"
        />

        <StudyTable
          v-else
          :trials="trials"
          :filterStatus="activeTab"
          @view="handleViewTrial"
        />

        <PatientCard
        :patient="selectedPatient"
        v-model="showPatientModal"
      />
      </div>
    </div>
  </div>
</template>
