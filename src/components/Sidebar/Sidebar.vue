<script setup lang="ts">
import { ref } from 'vue';
import { Account, AccountSwap, Logout } from '@/components';

const collapsed = ref(true);
</script>

<template>
  <div
    class="h-[85vh] flex flex-col absolute sm:h-screen sm: w-16 sm:w-16 sm:hover:w-72 transition-all duration-300 overflow-hidden bg-white shadow-lg"
    @mouseenter="collapsed = false"
    @mouseleave="collapsed = true"
  >
    <!-- Top section (Account) hidden on mobile -->
    <div class="flex-col px-2 hidden sm:flex">
      <Account :collapsed="collapsed" />
    </div>

    <!-- Account buttons -->
    <AccountSwap :collapsed="collapsed" class="flex-1" />

    <!-- Logout button hidden on mobile -->
    <div class="px-2 mt-auto">
      <Logout :collapsed="collapsed" />
    </div>
  </div>
</template>
