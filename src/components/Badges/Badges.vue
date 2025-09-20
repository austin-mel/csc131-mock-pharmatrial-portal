<script setup lang="ts">
import { defineProps } from 'vue';
import type { BadgeStatus } from '@/types'; // Import the type
 // Import the type

// Props for the Badge component
const props = defineProps({
  status: {
    type: String as () => BadgeStatus, // Use the BadgeStatus type
    required: true,
  },
});
</script>

<template>
  <span
    :class="[
      'inline-block px-4 py-2 rounded-full font-bold text-center capitalize transition-all duration-300 ease-in-out',
      status === 'active' ? 'bg-green-500 text-white' : '',
      status === 'pending' ? 'bg-yellow-500 text-black' : '',
      status === 'completed' ? 'bg-blue-500 text-white' : ''
    ]"
  >
    {{ status.charAt(0).toUpperCase() + status.slice(1) }}
  </span>
</template>
