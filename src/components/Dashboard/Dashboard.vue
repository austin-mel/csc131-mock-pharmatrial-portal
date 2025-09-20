<script setup lang="ts">
import { ref } from 'vue';
import { Sidebar, NewStudy, SortTabs, StudyTable, PatientTable } from '@/components';
import { useAuthStore } from '@/stores';
import type { Trial } from '@/types';

const auth = useAuthStore();
const activeTab = ref('all');

// Local trial data for demonstration (can be fetched from API)
const trials = ref<Trial[]>([
  { name: 'Trial A', id: '001', status: 'active' },
  { name: 'Trial B', id: '002', status: 'pending' },
  { name: 'Trial C', id: '003', status: 'completed' },
  { name: 'Trial D', id: '004', status: 'rejected' },
]);
</script>

<template>
  <div class="flex">
    <Sidebar v-if="auth.isLoggedIn" />

    <div class="bg-white w-screen rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] sm:h-[100vh] shadow p-4">
      <div class="flex justify-center sm:justify-between items-center mb-4">
        <NewStudy />
        <SortTabs v-model:activeTab="activeTab" />
      </div>

      <div class="flex">
        <PatientTable v-if="['JHAdmin', 'JHDoctor'].includes(auth.accountType)" />
        <StudyTable v-else :trials="trials" :filterStatus="activeTab" />
      </div>
    </div>
  </div>
</template>
