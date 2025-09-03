<script setup lang="ts">
import { BavariaLogo, JHLogo, FDALogo } from "@/assets";


import { Routes } from "@/router";
import { useAuthStore } from "@/stores";
import { computed } from "vue";

const auth = useAuthStore()

const logoMap: Record<string, string> = {
  bavaria: BavariaLogo,
  jh: JHLogo,
  fda: FDALogo,
};

const currentLogo = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
    return logoMap[auth.accountType];
});
</script>

<template>
    <header class="w-full flex justify-end">
        <img v-if="currentLogo" class="w-80 px-10 py-3 fixed" :src="currentLogo"></img>
    </header>
</template>
