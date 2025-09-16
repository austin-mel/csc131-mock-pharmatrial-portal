<script setup lang="ts">
import { Account, AccountSwap, Logout } from '@/components';
import { ref } from 'vue';

const collapsed = ref(true);
</script>

<template>
  <div
    @mouseenter="collapsed = false"
    @mouseleave="collapsed = true"
    class="h-screen flex flex-col absolute w-24 hover:w-72 transition-all duration-300 overflow-hidden bg-white shadow-lg">

    <div class="flex flex-col px-2">
      <Account :collapsed="collapsed" />
    </div>

    <AccountSwap :collapsed="collapsed" />

    <div class="mt-auto px-2">
      <Logout :collapsed="collapsed" />
    </div>
  </div>
</template>
