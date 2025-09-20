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

  return props.trial.approvals[role] === true && props.trial.active === true;
});
</script>

<template>
  <button
    :disabled="isDisabled"
    :class="[
      'relative flex items-center text-white font-bold py-2 px-2 rounded',
      isDisabled
        ? 'bg-blue-300 cursor-not-allowed opacity-50'
        : 'bg-blue-500 hover:bg-blue-700'
    ]"
  >
    Send Drugs
  </button>
</template>