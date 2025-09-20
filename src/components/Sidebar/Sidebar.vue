<script setup lang="ts">
import { ref } from 'vue';
import { Account, AccountSwap, Logout } from '@/components';

const collapsed = ref(true);
</script>

<template>
  <div
    class="fixed top-0 left-0 flex flex-col w-16 sm:w-16 sm:hover:w-72 h-screen transition-all duration-300 bg-white shadow-lg overflow-hidden z-50"
    @mouseenter="collapsed = false"
    @mouseleave="collapsed = true">
    <div class="flex-col px-2 hidden sm:flex">
      <Account :collapsed="collapsed" />
    </div>

    <AccountSwap v-model:collapsed="collapsed"  class="flex-1" />

    <div class="px-2 mt-auto">
      <Logout :collapsed="collapsed" />
    </div>
  </div>
</template>
