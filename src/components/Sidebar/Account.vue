<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores';
import { BavariaLogo, JHLogo, FDALogo } from '@/assets';

defineProps<{
  collapsed: boolean
}>();

const auth = useAuthStore();

const currentRole = computed(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
  return auth.accountType;
});

const logoMap: Record<string, string> = {
  Bavaria: BavariaLogo,
  JHDoctor: JHLogo,
  JHAdmin: JHLogo,
  FDA: FDALogo,
};

const roleLogo = computed(() => logoMap[currentRole.value] || BavariaLogo);
</script>

<template>
  <div class="border-b h-[10rem] mb-2 mt-2 pb-4 border-stone-300">
    <button
      class="relative flex w-full h-full items-center rounded transition-all duration-300 hover:bg-stone-200"
      :class="collapsed ? 'justify-center' : 'justify-start'">
      <img
        :src="roleLogo"
        alt="avatar"
        class="transition-all duration-300 rounded shrink-0 shadow-lg"
        :class="collapsed ? 'w-20 h-20' : 'w-12 h-12'"/>

      <div
        class="absolute left-16 transition-all duration-300"
        :class="collapsed ? 'opacity-0 -translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'">
        <span class="text-lg font-bold block">FIRST LASTNAME</span>
        <span class="text-sm block text-stone-500">contact@realworldemail.com</span>
      </div>
    </button>
  </div>
</template>
