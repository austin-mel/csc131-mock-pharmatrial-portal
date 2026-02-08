<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Sidebar,
  NewStudy,
  SortTabs,
  StudyTable,
  PatientTable,
  PatientCard,
  Pagination,
} from '@/components'
import { useAuthStore } from '@/stores'
import { getPatients, getTrials, getPatientById, getTrialById } from '@/services/api'
import type { Trial, PatientInformation } from '@/types'

const auth = useAuthStore()

const activeTab = ref('all')

const showPatientTable = ref(false)
const selectedTrial = ref<Trial | null>(null)
const selectedPatient = ref<PatientInformation | null>(null)
const showPatientModal = ref(false)

const patients = ref<PatientInformation[]>([])
const trials = ref<Trial[]>([])

const resultsPerPage = 10
const currentTrialPage = ref(1)
const currentPatientPage = ref(1)

function handleViewTrial(trial: Trial) {
  selectedTrial.value = trial
  showPatientTable.value = true
  currentPatientPage.value = 1
}

async function handleViewPatient(patientId: string) {
  try {
    const { data } = await getPatientById(patientId)
    selectedPatient.value = data
    showPatientModal.value = true
  } catch (err) {
    console.error('Failed to load patient details', err)
  }
}

function resetView() {
  selectedTrial.value = null
  selectedPatient.value = null
  showPatientTable.value = false
  activeTab.value = 'all'
  currentTrialPage.value = 1
  currentPatientPage.value = 1
}

watch(() => auth.accountType, resetView)

watch(activeTab, () => {
  currentTrialPage.value = 1
})

const filteredTrials = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return trials.value.filter(t => t.status === 'pending')
    case 'active':
      return trials.value.filter(t => t.status === 'active')
    case 'completed':
      return trials.value.filter(t => t.status === 'completed')
    case 'rejected':
      return trials.value.filter(t => t.status === 'rejected')
    default:
      return trials.value
  }
})

const filteredPatients = computed(() => {
  const trial = selectedTrial.value
  if (!trial) return []
  return patients.value.filter(p => p.study_id === trial.id)
})

const paginatedTrials = computed(() => {
  const start = (currentTrialPage.value - 1) * resultsPerPage
  return filteredTrials.value.slice(start, start + resultsPerPage)
})

const paginatedPatients = computed(() => {
  const start = (currentPatientPage.value - 1) * resultsPerPage
  return filteredPatients.value.slice(start, start + resultsPerPage)
})

async function loadData() {
  const [patientsRes, trialsRes] = await Promise.all([
    getPatients(),
    getTrials(),
  ])

  patients.value = patientsRes.data
  trials.value = trialsRes.data
}

onMounted(loadData)
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
        <SortTabs
          v-if="!showPatientTable"
          v-model:activeTab="activeTab"
        />

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
          :patients="patients"
          @view="handleViewPatient"
        />

        <StudyTable
          v-else
          :trials="trials"
          @view="handleViewTrial"
        />

        <PatientCard
          :patient="selectedPatient"
          v-model="showPatientModal"
        />
      </div>

      <div class="flex justify-center">
        <Pagination
          v-if="showPatientTable"
          v-model="currentPatientPage"
          :totalItems="filteredPatients.length"
          :itemsPerPage="resultsPerPage"
        />

        <Pagination
          v-else
          v-model="currentTrialPage"
          :totalItems="filteredTrials.length"
          :itemsPerPage="resultsPerPage"
        />
      </div>
    </div>
  </div>
</template>
