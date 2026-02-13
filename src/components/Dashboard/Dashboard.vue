<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Sidebar,
  NewStudy,
  SortTabs,
  StudyTable,
  PatientTable,
  PatientCard,
  Pagination
} from '@/components'

import { useAuthStore } from '@/stores'
import { getPatients, getTrials, getPatientById } from '@/services/api'
import type { Trial, PatientInformation } from '@/types'

const auth = useAuthStore()

const activeTab = ref('All')

const showPatientTable = ref(false)
const selectedTrial = ref<Trial | null>(null)
const selectedPatient = ref<PatientInformation | null>(null)
const showPatientModal = ref(false)

const patients = ref<PatientInformation[]>([])
const trials = ref<Trial[]>([])

const isMobile = ref(window.innerWidth < 640)

function handleResize() {
  isMobile.value = window.innerWidth < 640
}

window.addEventListener('resize', handleResize)

const trialPageSize = computed(() => (isMobile.value ? 3 : 6))
const patientPageSize = computed(() => (isMobile.value ? 6 : 10))

const currentTrialPage = ref(1)
const currentPatientPage = ref(1)

async function loadData() {
  try {
    const [patientsRes, trialsRes] = await Promise.all([
      getPatients(),
      getTrials()
    ])

    patients.value = patientsRes.data
    trials.value = trialsRes.data
  } catch (err) {
    console.error('Failed loading dashboard data:', err)
  }
}

onMounted(loadData)

function handleViewTrial(trial: Trial) {
  selectedTrial.value = trial
  showPatientTable.value = true
  currentPatientPage.value = 1
}

async function handleViewPatient(id: string) {
  try {
    const { data } = await getPatientById(id)
    selectedPatient.value = data
    showPatientModal.value = true
  } catch (err) {
    console.error('Failed loading patient:', err)
  }
}

function resetView() {
  selectedTrial.value = null
  selectedPatient.value = null
  showPatientTable.value = false
  activeTab.value = 'All'
  currentTrialPage.value = 1
  currentPatientPage.value = 1
}

watch(() => auth.accountType, resetView)
watch(activeTab, () => (currentTrialPage.value = 1))

const filteredTrials = computed(() => {
  if (activeTab.value === 'All') return trials.value
  return trials.value.filter(t => t.status === activeTab.value)
})

const filteredPatients = computed(() => {
  if (!selectedTrial.value) return []
  return patients.value.filter(p => p.study_id === selectedTrial.value!.id)
})

const paginatedTrials = computed(() => {
  const start = (currentTrialPage.value - 1) * trialPageSize.value
  return filteredTrials.value.slice(start, start + trialPageSize.value)
})

const paginatedPatients = computed(() => {
  const start = (currentPatientPage.value - 1) * patientPageSize.value
  return filteredPatients.value.slice(start, start + patientPageSize.value)
})
</script>

<template>
  <div class="flex">
    <Sidebar v-if="auth.isLoggedIn" @reset-view="resetView" />

    <div class="bg-white w-screen rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] shadow p-4">
      
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
          :patients="paginatedPatients"
          @view="handleViewPatient"
        />

        <StudyTable
          v-else
          :trials="paginatedTrials"
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
          :itemsPerPage="patientPageSize"
        />

        <Pagination
          v-else
          v-model="currentTrialPage"
          :totalItems="filteredTrials.length"
          :itemsPerPage="trialPageSize"
        />
      </div>
    </div>
  </div>
</template>
