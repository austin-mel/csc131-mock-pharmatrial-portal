<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  currentStep: number;
}>();

const totalSteps = 4;

const steps = computed(() =>
  Array.from({ length: totalSteps }, (_, i) => i + 1)
);
</script>

<template>
  <div class="flex items-center justify-center space-x-4">
    <template v-for="step in steps" :key="step">
      <div class="flex items-center">
        <div
          :class="[
            'w-6 h-6 rounded-full border flex items-center justify-center text-white text-xs font-bold',
            step < currentStep
              ? 'bg-indigo-600 border-indigo-600'
              : step === currentStep
              ? 'border-indigo-600 text-indigo-600'
              : 'border-gray-300 text-gray-400'
          ]"
        >
          <span v-if="step < currentStep"></span>
          <span v-else-if="step === currentStep"></span>
        </div>

        <div
          v-if="step < totalSteps"
          :class="[
            'w-10 h-0.5 mx-1',
            step < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
          ]"
        ></div>
      </div>
    </template>
  </div>
</template>
