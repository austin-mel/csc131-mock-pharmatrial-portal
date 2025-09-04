<script setup lang="ts">
import { BavariaLogo, JHLogo, FDALogo } from "@/assets";


import { Routes } from "@/router";
import { useAuthStore } from "@/stores";
import { computed } from "vue";
import { Sidebar } from "@/components/Sidebar";

const auth = useAuthStore()

const logoMap: Record<string, string> = {
  Bavaria: BavariaLogo,
  JaneHopkins: JHLogo,
  FDA: FDALogo,
};

const currentLogo = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
    return logoMap[auth.accountType];
});
</script>

<template>
    <header class="flex">
        <div class="justify-start">
            <img v-if="currentLogo" class="absolute w-80 px-10 py-3 top-0 right-0" :src="currentLogo" />
        </div>    
    </header>
</template>
