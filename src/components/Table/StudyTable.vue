<script setup lang="ts">
import { computed, defineProps, ref, onMounted } from 'vue';
import { ActionButton, ViewButton, Badges } from '@/components';
import type { Trial } from '@/types';
import { useAuthStore } from '@/stores';
import { getTrials } from '@/services/api';

const trials = ref<Trial[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getTrials();
    trials.value = response.data;
  } catch (err) {
    console.error('Failed to load trials', err);
  } finally {
    loading.value = false;
  }
});

const auth = useAuthStore();

// Determine the current user role key for approvals
const userRoleKey = computed(() => {
  switch (auth.accountType) {
    case 'JHAdmin':
    case 'JHDoctor':
      return 'jh';
    case 'FDA':
      return 'fda';
    case 'Bavaria':
      return 'bav';
    default:
      return '';
  }
});

</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trial Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trial ID</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Status</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">View</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="trial in trials" :key="trial.id" class="block md:table-row">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">{{ trial.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ trial.id }}</td>
          <td class="px-6 py-4 text-center text-sm hidden md:table-cell">
            <Badges :status="trial.status" />
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <div class="flex justify-center">
              <ViewButton @click="$emit('view', trial)" />
            </div>
          </td>
          <td class="px-6 py-4 text-sm hidden md:table-cell">
            <template v-if="!trial.rejected">
              <!-- Completed -->
              <div v-if="trial.completed" class="flex justify-center">
                <ActionButton
                  label="View Report"
                  :disabled="!userRoleKey || !trial.completed"
                  color="purple"
                />
              </div>

              <!-- Pending approvals -->
              <div v-else-if="Object.values(trial.approvals).some(v => v === false || v === undefined)"
                   class="flex justify-center gap-2">
                <ActionButton
                  label="Approve"
                  :disabled="!userRoleKey || trial.approvals[userRoleKey]"
                  color="green"
                  @click="trial.approvals[userRoleKey] = true"
                />
                <ActionButton
                  label="Reject"
                  :disabled="!userRoleKey || trial.approvals[userRoleKey]"
                  color="red"
                  @click="trial.rejected = true"
                />
              </div>

              <!-- All approved -->
              <div v-else-if="Object.values(trial.approvals).every(v => v === true)" class="flex justify-center">
                <ActionButton
                  :label="userRoleKey === 'fda' ? 'Repackage Drugs' : userRoleKey === 'jh' ? 'Distribute Drugs' : 'Send Drugs'"
                  :disabled="!userRoleKey || trial.distributed?.[userRoleKey]"
                  color="blue"
                />
              </div>
            </template>
          </td>

          <!-- Mobile version -->
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
              <ViewButton @click="$emit('view', trial)" />

              <template v-if="!trial.rejected">
                <div v-if="trial.completed" class="flex justify-center">
                  <ActionButton
                    label="View Report"
                    :disabled="!userRoleKey || !trial.completed"
                    color="purple"
                  />
                </div>

                <div v-else-if="Object.values(trial.approvals).some(v => v === false || v === undefined)"
                     class="flex justify-center gap-2">
                  <ActionButton
                    label="Approve"
                    :disabled="!userRoleKey || trial.approvals[userRoleKey]"
                    color="green"
                    @click="trial.approvals[userRoleKey] = true"
                  />
                  <ActionButton
                    label="Reject"
                    :disabled="!userRoleKey || trial.approvals[userRoleKey]"
                    color="red"
                    @click="trial.rejected = true"
                  />
                </div>

                <div v-else-if="Object.values(trial.approvals).every(v => v === true)" class="flex justify-center">
                  <ActionButton
                    :label="userRoleKey === 'fda' ? 'Repackage Drugs' : userRoleKey === 'jh' ? 'Distribute Drugs' : 'Send Drugs'"
                    :disabled="!userRoleKey || trial.distributed?.[userRoleKey]"
                    color="blue"
                  />
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
