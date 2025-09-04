<script setup lang="ts">
import { BavariaLogo } from '@/assets';
import { useAuthStore } from "@/stores";

</script>

<template>
    <div class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
        <button class="flex p-1 rounded gap-2 relative w-full items-center transition-colors hover:bg-stone-200">
            <img :src="BavariaLogo" alt="avatar" class="size-8 rounded shrink-0 bg-blue-600 shadow"></img>
            <div class="text-start">
                <span class="text-md font-bold block">FIRST LASTNAME</span>
                <span class="text-sm block text-stone-500">contat@realworldemail.com</span>
            </div>
        </button>
    </div>
</template>