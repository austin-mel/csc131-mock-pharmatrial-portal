<script setup lang="ts">
import { ref } from 'vue'

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
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Trial Name
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Trial ID
          </th>
          <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            View
          </th>
          <th scope="col" class="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="trial in trials" :key="trial.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ trial.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ trial.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            Badge
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            View
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
            Actions
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
