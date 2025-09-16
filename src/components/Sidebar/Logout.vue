<script setup lang="ts">
import { LogoutIcon } from '@/assets/icons'
</script>

<template>
    <div class="ml-2 mb-2 mt-auto pb-4">
        <button class="flex pt-5 pb-5 rounded gap-10 relative w-full justify-center transition-colors hover:bg-stone-200">
            <span class="text-2xl font-bold">Logout</span>
            <LogoutIcon class="w-8 h-8" />
        </button>
    </div>
</template>