<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores';
import { ViewButton } from '@/components';

// Mock data
const trials = ref([
  { name: 'Jane Doe', id: '00af1', status: '1' },
  { name: 'Josh Allen', id: '00eaga2', status: '4' },
  { name: 'Lighnting McQueen', id: '00313513', status: '5' },
])

const auth = useAuthStore();

const currentRole = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
  return auth.accountType;
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Stage</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">View</th>
          <th v-if="currentRole === 'JHAdmin'" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Eligibility</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="trial in trials" :key="trial.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">
            {{ trial.name }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
            {{ trial.id }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            {{ trial.status }}
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <ViewButton />
          </td>
          <td v-if="currentRole === 'JHAdmin'" class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">Eligibility</td>

          <!-- Mobile -->
          <td colspan="5" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ trial.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ trial.id }}</p>
              </div>
              <div v-if="currentRole === 'JHAdmin'" class="text-sm font-medium text-gray-700">
                Eligibility
              </div>
            </div>

            <div class="flex justify-between items-center mt-3 pt-2">
              <ViewButton />
              <div class="text-sm font-medium">{{ trial.status }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
