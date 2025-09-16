<script setup lang="ts">
import { LogoutIcon } from '@/assets/icons'
</script>

<template>
  <div class="mb-2 mt-auto pb-4">
    <button class="relative flex w-full items-center justify-center rounded px-4 py-4 transition-colors hover:bg-stone-200">
      <span class="text-2xl font-bold">Logout</span>
      <LogoutIcon class="absolute right-0 w-12 h-12" />
    </button>
  </div>
</template>
