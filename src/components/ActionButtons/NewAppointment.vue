<script setup lang="ts">
import { PlusIcon } from '@/assets';
const emit = defineEmits(['click']);
</script>

<template>
    <button
      @click="$emit('click')"
      class="relative flex items-center px-2 border-1 rounded border-stone-800 hover:bg-stone-700">
      <PlusIcon class="w-8 h-8 pr-2"/>

      New Appointment
    </button>
</template>