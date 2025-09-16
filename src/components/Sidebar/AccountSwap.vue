<script setup lang="ts">
import { DoctorIcon, AdminIcon, JHAdminIcon, PharmaIcon } from '@/assets';
</script>

<template>
    <div class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
        <button class="flex pt-5 pb-5 rounded gap-10 relative w-full justify-center transition-colors hover:bg-stone-200">
                <span class="text-2xl font-bold">JH Doctor</span>
                <DoctorIcon class="w-8 h-8" />
        </button>
    </div>
    <div class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
        <button class="flex pt-5 pb-5 rounded gap-10 relative w-full justify-center transition-colors hover:bg-stone-200">
                <span class="text-2xl font-bold">JH Admin</span>
                <JHAdminIcon class="w-8 h-8" />
        </button>
    </div>
    <div class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
        <button class="flex pt-5 pb-5 rounded gap-10 relative w-full justify-center transition-colors hover:bg-stone-200">
                <span class="text-2xl font-bold">FDA Admin</span>
                <AdminIcon class="w-8 h-8" />
        </button>
    </div>
    <div class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
        <button class="flex pt-5 pb-5 rounded gap-10 relative w-full justify-center transition-colors hover:bg-stone-200">
                <span class="text-2xl font-bold">Bavaria Admin</span>
                <PharmaIcon class="w-8 h-8" />
        </button>
    </div>
</template>