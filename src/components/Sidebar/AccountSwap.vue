<script setup lang="ts">
import { computed } from 'vue';
import type { UserRole } from '@/types';
import { useAuthStore } from '@/stores';
import { DoctorIcon, AdminIcon, JHAdminIcon, PharmaIcon } from '@/assets';

defineProps<{
  collapsed: boolean
}>();

const auth = useAuthStore();

const currentAccount = computed<UserRole | ''>(() => {
  if (!auth.isLoggedIn || !auth.accountType) return '';
  return auth.accountType as UserRole;
});

const accounts = [
  { label: 'JH Doctor', icon: DoctorIcon, role: 'JHDoctor' },
  { label: 'JH Admin', icon: JHAdminIcon, role: 'JHAdmin' },
  { label: 'FDA Admin', icon: AdminIcon, role: 'FDA' },
  { label: 'Bavaria Admin', icon: PharmaIcon, role: 'Bavaria' },
];
</script>

<template>
  <div class="flex flex-col mt-4">
    <div
      v-for="({ label, icon, role }, index) in accounts"
      :key="index"
      class="border-b mb-2 border-stone-300 w-full">
      <button
        :disabled="currentAccount === role"
        class="relative flex items-center w-full h-16 px-4 rounded transition-all duration-300 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-400">
        <span
          class="text-2xl font-bold transition-all duration-300 whitespace-nowrap absolute left-4"
          :class="{
            'opacity-0 -translate-x-2 pointer-events-none': collapsed,
            'opacity-100 translate-x-0 pointer-events-auto': !collapsed
          }">
          {{ label }}
        </span>

        <component
          :is="icon"
          class="transition-all duration-300"
          :class="collapsed ? 'w-10 h-10 mx-auto' : 'w-8 h-8 ml-auto'"
        />
      </button>
    </div>
  </div>
</template>
