<script setup lang="ts">
import { ref, watch } from 'vue'
import { Drawer } from '@/components'
import type { PatientInformation } from '@/types'

const props = defineProps<{
  patient: PatientInformation | null
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const showModal = ref(props.modelValue)

watch(() => props.modelValue, (val) => (showModal.value = val))
watch(showModal, (val) => emit('update:modelValue', val))
</script>

<template>
  <Drawer v-model="showModal">
    <h2 class="text-xl font-bold mb-4">Patient Information</h2>
    <div v-if="props.patient" class="flex flex-col gap-2">
      <p><strong>Name:</strong> {{ props.patient.name.first }} {{ props.patient.name.last }}</p>
      <p><strong>ID:</strong> {{ props.patient.id }}</p>
      <p><strong>DOB:</strong> {{ props.patient.dob }}</p>
      <p><strong>Blood Type:</strong> {{ props.patient.blood }}</p>
      <p><strong>Dose:</strong> {{ props.patient.dose }}</p>
      <p><strong>Eligibility:</strong> {{ props.patient.eligibility ? 'Eligible' : 'Not eligible' }}</p>
    </div>
  </Drawer>
</template>
