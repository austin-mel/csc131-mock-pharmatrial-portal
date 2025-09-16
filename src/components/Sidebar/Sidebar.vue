<script setup lang="ts">
import { Account, AccountSwap, Logout } from '@/components';

</script>

<template>
  <div class="w-[18rem] h-screen flex flex-col absolute">
    <div>
      <Account />
      <AccountSwap />
    </div>
    <div class="mt-auto">
      <Logout />
    </div>
  </div>
</template>