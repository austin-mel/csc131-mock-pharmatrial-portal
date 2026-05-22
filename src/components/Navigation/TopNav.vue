<template>
  <nav class="sticky top-0 z-[200] flex min-h-14 items-center gap-3 bg-[#1a1714] px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,.18)] md:h-14 md:gap-5 md:px-7 md:py-0">
    <div class="flex-1 font-['DM_Serif_Display',serif] text-[17px] text-white">
      Clinical Trial <span class="italic text-white/40">Data Exchange</span>
    </div>
    <div class="hidden font-['DM_Mono',monospace] text-[11px] uppercase tracking-[.12em] text-white/45 sm:block">
      {{ auth.currentPortal?.label }}
    </div>
    <div v-if="auth.currentPortal" class="flex items-center gap-2.5 text-[13px] text-white/70">
      <UserAvatar :text="auth.currentPortal.abbr" :color="auth.currentPortal.color" />
      <span class="hidden sm:inline">{{ auth.currentPortal.user }}</span>
      <button
        class="cursor-pointer rounded border-0 bg-white/10 px-2.5 py-[5px] font-['DM_Mono',monospace] text-[10px] uppercase tracking-[.1em] text-white/60"
        @click="auth.logout"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import UserAvatar from "@/components/UserAvatar";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
</script>
