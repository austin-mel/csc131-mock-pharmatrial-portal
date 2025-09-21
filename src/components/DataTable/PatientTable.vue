<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores';
import { ViewButton } from '@/components';
import { CheckIcon, RejectIcon } from '@/assets';
import type { PatientInformation, Appointment, Trial } from '@/types';
import { ProgressBar } from '../ProgressBar';

const auth = useAuthStore();

const currentRole = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
  return auth.accountType;
});

const props = defineProps<{
  patients: PatientInformation[];
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Stage</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">View</th>
          <th v-if="currentRole === 'JHAdmin'" class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Eligibility</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="patient in props.patients" :key="patient.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">
            {{ patient.name.first }} {{ patient.name.last }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
            {{ patient.id }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <ProgressBar :currentStep=patient.dose />
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <div class="flex justify-center">
              <ViewButton @click="$emit('view', patient)" />
            </div>
          </td>
          <td v-if="currentRole === 'JHAdmin'" class="px-6 py-4 hidden md:table-cell"> 
            <component :is="patient.eligibility ? CheckIcon : RejectIcon" class="w-8 h-8" aria-hidden="true" /> 
            <span class="sr-only">{{ patient.eligibility ? 'Eligible' : 'Not eligible' }}</span> 
          </td>

          <!-- Mobile -->
          <td colspan="5" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ patient.name.first }} {{ patient.name.last }}</p>
                <p class="text-xs text-gray-500">ID: {{ patient.id }}</p>
              </div>
              <div v-if="currentRole === 'JHAdmin'"> 
                <component :is="patient.eligibility ? CheckIcon : RejectIcon" class="w-8 h-8" aria-hidden="true" /> 
                <span class="sr-only">{{ patient.eligibility ? 'Eligible' : 'Not eligible' }}</span> 
              </div>
            </div>

            <div class="flex justify-between items-center mt-3 pt-2">
              <ViewButton @click="$emit('view', patient)" />
              <div class="text-md font-medium">Dose: {{ patient.dose }} / 5</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
