<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { Sidebar, NewStudy, SortTabs, StudyTable, PatientTable } from "@/components";

const auth = useAuthStore()
</script>

<template>
  <div class="flex">
        <Sidebar v-if="auth.isLoggedIn" />

    <div class="bg-white w-screen rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] sm:h-[100vh] shadow p-4">
      <div class="flex justify-center sm:justify-between items-center mb-4">
        <NewStudy />
        <SortTabs />
      </div>
<div class="flex">
  <PatientTable v-if="['JHAdmin', 'JHDoctor'].includes(auth.accountType)" />
  <StudyTable v-else />
</div>
    </div>
  </div>
</template>