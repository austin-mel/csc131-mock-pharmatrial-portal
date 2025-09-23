<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { Trial } from '@/types';

const props = defineProps<{
  trial: Trial;
  userRoleKey: string;
}>();

const isDisabled = computed(() => {
  const role = props.userRoleKey;

  if (!role || !props.trial.approvals) return true;

  return props.trial.approvals[role] === true;
});
</script>

<template>
  <button
    :disabled="isDisabled"
    :class="[
      'relative flex items-center text-white font-bold py-2 px-2 rounded',
      isDisabled
        ? 'bg-green-400 cursor-not-allowed opacity-50'
        : 'bg-green-700 hover:bg-green-900'
    ]"
  >
    Approve
  </button>
</template>