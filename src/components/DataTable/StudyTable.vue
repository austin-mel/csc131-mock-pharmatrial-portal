<script setup lang="ts">
import { ref } from 'vue'
import { ApproveButton, DrugsButton, RejectButton, ReportButton, ViewButton, Badges } from '@/components';

// Mock data
const trials = ref([
  { name: 'Trial A', id: '001', status: 'Active' },
  { name: 'Trial B', id: '002', status: 'Pending' },
  { name: 'Trial C', id: '003', status: 'Completed' },
])
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trial Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trial ID</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">View</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
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
            <Badge :status="trial.status" />
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <ViewButton />
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <ApproveButton />
          </td>

          <!-- Mobile -->
          <td colspan="5" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ trial.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ trial.id }}</p>
              </div>
              <div class="text-sm font-medium text-gray-700">
                {{ trial.status }}
              </div>
            </div>

            <div class="flex justify-between items-center mt-3 pt-2">
              <ViewButton />
              <RejectButton />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
