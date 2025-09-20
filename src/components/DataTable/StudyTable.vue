<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { ApproveButton, RejectButton, ViewButton, Badges } from '@/components';
import type { Trial } from '@/types';

const props = defineProps<{
  trials: Trial[];
  filterStatus: string;
}>();

const filteredTrials = computed(() => {
  if (props.filterStatus === 'all') return props.trials;

  return props.trials.filter(
    (trial) => trial.status.toLowerCase() === props.filterStatus.toLowerCase()
  );
});
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
        <tr v-for="trial in filteredTrials" :key="trial.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">{{ trial.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ trial.id }}</td>
          <td class="px-6 py-4 text-sm hidden md:table-cell"><Badges :status="trial.status" /></td>
          <td class="px-6 py-4 text-sm hidden md:table-cell"><ViewButton /></td>
          <td class="px-6 py-4 text-sm hidden md:table-cell"><ApproveButton /></td>

          <!-- Mobile -->
          <td colspan="5" class="block md:hidden px-6 py-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ trial.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ trial.id }}</p>
              </div>
              <div class="text-sm font-medium text-gray-700">
                <Badges :status="trial.status" />
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
