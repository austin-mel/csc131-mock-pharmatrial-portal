<script setup lang="ts">
import { defineProps } from 'vue';
import type { BadgeStatus } from '@/types';

const props = defineProps({
  status: {
    type: String as () => BadgeStatus,
    required: true,
  },
});
</script>

<template>
  <span
    :class="[
      'inline-block px-4 py-2 rounded-full font-bold text-center capitalize',
      status === 'active' ? 'bg-yellow-400' : '',
      status === 'pending' ? 'bg-gray-400' : '',
      status === 'completed' ? 'bg-green-400' : '',
      status === 'rejected' ? 'bg-red-400' : ''
    ]"
  >
    {{ status }}
  </span>
</template>
