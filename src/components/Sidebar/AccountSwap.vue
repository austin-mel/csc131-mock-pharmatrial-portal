<script setup lang="ts">
import { DoctorIcon, AdminIcon, JHAdminIcon, PharmaIcon } from '@/assets';

import { computed } from 'vue'
import type { UserRole } from '@/types'
import { useAuthStore } from '@/stores'

const auth = useAuthStore()

const currentAccount = computed<UserRole | ''>(() => {
  if (!auth.isLoggedIn || !auth.accountType) return ''
    return auth.accountType as UserRole
})

const accounts = [
  { label: 'JH Doctor', icon: DoctorIcon, role: 'JHDoctor' },
  { label: 'JH Admin', icon: JHAdminIcon, role: 'JHAdmin' },
  { label: 'FDA Admin', icon: AdminIcon, role: 'FDA' },
  { label: 'Bavaria Admin', icon: PharmaIcon, role: 'Bavaria' },
]
</script>

<template>
  <div
    v-for="({ label, icon, role }, index) in accounts"
    :key="index"
    class="border-b ml-2 mb-2 mt-2 pb-4 border-stone-300">
    <button
      :disabled="currentAccount === role"
      class="flex items-center justify-between w-full px-4 py-5 rounded transition-colors
             hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed">
      <span class="text-2xl font-bold">{{ label }}</span>
      <component :is="icon" class="w-8 h-8" />
    </button>
  </div>
</template>