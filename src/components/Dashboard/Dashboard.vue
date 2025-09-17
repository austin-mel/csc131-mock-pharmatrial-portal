<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { Sidebar, NewStudy, SortTabs, DataTable } from "@/components";
const auth = useAuthStore()

</script>

<template>
  <div class="flex">
        <Sidebar v-if="auth.isLoggedIn" />

    <div class="bg-white w-screen rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] sm:h-[calc(100vh-375px)] shadow p-4">
      <div class="flex justify-between items-center mb-4">
        <NewStudy />
        <SortTabs />
      </div>
      <div class="flex">
        <DataTable />
      </div>
    </div>
  </div>
</template>