<script setup lang="ts">
import { computed, defineProps, ref, onMounted } from 'vue';
import { ViewButton } from '@/components';
import type { PatientInformation } from '@/types';
import { getPatients } from '@/services/api';

const patients = ref<PatientInformation[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getPatients();
    patients.value = response.data;
  } catch (err) {
    console.error('Failed to load patients', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Dose</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">View</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="patient in patients" :key="patient.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">
            {{ patient.first_name }} {{ patient.last_name }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
            {{ patient.id }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            {{ patient.dose }} / 5
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <div class="flex justify-center">
              <ViewButton @click="$emit('view', patient.id)" />
            </div>
          </td>

          <!-- Mobile view -->
          <td colspan="4" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ patient.first_name }} {{ patient.last_name }}</p>
                <p class="text-xs text-gray-500">ID: {{ patient.id }}</p>
                <p class="text-sm font-medium text-gray-700">Dose: {{ patient.dose }} / 5</p>
              </div>
              <ViewButton @click="$emit('view', patient.id)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
