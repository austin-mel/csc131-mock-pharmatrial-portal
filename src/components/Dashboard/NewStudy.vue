<script setup lang="ts">
import { PlusIcon } from '@/assets';
</script>

<template>
    <button
      class="relative flex items-center h-[3rem] px-4 rounded transition-all duration-300 hover:bg-stone-200">
      <PlusIcon class="w-8 h-8"/>
      
      <span class="px-4">Create New Study</span>
    </button>
</template>