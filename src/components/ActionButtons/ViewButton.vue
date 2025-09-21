<script setup lang="ts">
import { EyeIcon } from '@/assets';
const emit = defineEmits(['click']);
</script>

<template>
    <button
      @click="$emit('click')"
      class="relative flex items-center h-[3rem] px-4 border-1 rounded transition-all duration-300 hover:bg-stone-200">
      <EyeIcon class="w-8 h-8 pr-2"/>

      View
    </button>
</template>