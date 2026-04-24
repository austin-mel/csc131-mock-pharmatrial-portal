<script setup lang="ts">
import { computed } from 'vue'
import { ActionButton, ViewButton, Badges } from '@/components';
import type { Trial, UserRole } from '@/types'
import { useAuthStore } from '@/stores'

const props = defineProps<{
  trials: Trial[]
}>()

const emit = defineEmits<{
  (e: 'view', trial: Trial): void
}>()

const auth = useAuthStore()

function pendingApprovals(trial: Trial) {
  return (
    trial.approvals.JHDoctor === false ||
    trial.approvals.FDA === false ||
    trial.approvals.Bavaria === false ||
    true
  )
}

function distributionLabel() {
  if (auth.accountType === 'FDA') return 'Repackage Drugs'
  if (auth.accountType === 'JHDoctor') return 'Distribute Drugs'
  return 'Send Drugs'
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 w-full">
    <table class="min-w-full divide-y divide-gray-200">
      
      <!-- Desktop Headers -->
      <thead class="bg-gray-50 hidden md:table-header-group">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trial Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trial ID</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Status</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">View</th>
          <th class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">

        <!-- Row -->
        <tr
          v-for="trial in props.trials"
          :key="trial.id"
          class="block md:table-row"
        >
          <!-- Desktop: Name -->
          <td class="px-6 py-4 text-sm text-gray-900 hidden md:table-cell">
            {{ trial.name }}
          </td>

          <!-- Desktop: ID -->
          <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
            {{ trial.id }}
          </td>

          <!-- Desktop: Status -->
          <td class="px-6 py-4 text-center text-sm hidden md:table-cell">
            <Badges :status="trial.status" />
          </td>

          <!-- Desktop: View -->
          <td class="px-6 py-4 hidden md:table-cell">
            <div class="flex justify-center">
              <ViewButton @click="emit('view', trial)" />
            </div>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 hidden md:table-cell">
            <template v-if="!trial.rejected && auth.accountType != 'JHAdmin'">

              <!-- Completed -->
              <div v-if="trial.completed" class="flex justify-center">
                <ActionButton
                  label="View Report"
                  color="purple"
                />
              </div>

              <!-- Pending approvals -->
                <div v-else-if="pendingApprovals(trial) === true" class="flex gap-2">
                  <ActionButton
                    label="Approve"
                    color="green"
                    @click=""
                  />
                  <ActionButton
                    label="Reject"
                    color="red"
                    @click=""
                  />
                </div>

              <!-- All approved -->
<!--               <div v-else class="flex justify-center">
                <ActionButton
                  :label="distributionLabel()"
                  color="blue"
                  :disabled="trial.distributed[auth.accountType!]"
                  @click=""
                />
              </div> -->

            </template>
          </td>

          <!-- MOBILE VERSION -->
          <td class="block md:hidden px-6 py-4" colspan="5">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ trial.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ trial.id }}</p>
              </div>
              <Badges :status="trial.status" />
            </div>

            <div class="flex justify-between items-center mt-3">
              <ViewButton @click="emit('view', trial)" />

              <template v-if="!trial.rejected">

                <!-- Completed -->
                <div v-if="trial.completed">
                  <ActionButton
                    label="View Report"
                    color="purple"
                    :disabled="!auth.accountType"
                  />
                </div>

                <!-- Pending -->
                <div v-else-if="pendingApprovals(trial)" class="flex gap-2">
                  <ActionButton
                    label="Approve"
                    color="green"
                    :disabled="!auth.accountType || trial.approvals[auth.accountType!]"
                    @click=""
                  />
                  <ActionButton
                    label="Reject"
                    color="red"
                    :disabled="!auth.accountType || trial.approvals[auth.accountType!]"
                    @click=""
                  />
                </div>

                <!-- Approved -->
<!--                 <div v-else>
                  <ActionButton
                    :label="distributionLabel()"
                    color="blue"
                    :disabled="!auth.accountType || trial.distributed[auth.accountType!]"
                    @click=""
                  />
                </div> -->

              </template>
            </div>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</template>
