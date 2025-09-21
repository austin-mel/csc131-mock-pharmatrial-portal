<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { UserRole } from '@/types'
import { useAuthStore } from '@/stores'
import { DoctorIcon, AdminIcon, JHAdminIcon, PharmaIcon } from '@/assets'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits(['update:collapsed', 'force-collapse', 'reset-view'])
const auth = useAuthStore()

const currentAccount = computed<UserRole | ''>(() => {
  if (!auth.isLoggedIn || !auth.accountType) return ''
  return auth.accountType as UserRole
})

const accounts: { label: string; icon: Component; role: UserRole }[] = [
  { label: 'JH Doctor', icon: DoctorIcon, role: 'JHDoctor' },
  { label: 'JH Admin', icon: JHAdminIcon, role: 'JHAdmin' },
  { label: 'FDA Admin', icon: AdminIcon, role: 'FDA' },
  { label: 'Bavaria Admin', icon: PharmaIcon, role: 'Bavaria' }
]

async function handleAccountClick(role: UserRole) {
  try {
    console.log('Sidebar: requesting login as', role)
    const result = auth.login ? auth.login(role) : null
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      await result as Promise<unknown>
    }
    console.log('Sidebar: login completed (or synchronous). Emitting reset-view.')
    emit('reset-view')
  } catch (err) {
    console.error('Sidebar: error during account swap', err)
    emit('reset-view')
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="({ label, icon, role }) in accounts"
      :key="role"
      class="border-b h-[7rem] border-stone-300 w-full"
    >
      <button
        :aria-label="label"
        @click="handleAccountClick(role)"
        :disabled="currentAccount === role"
        class="relative flex items-center w-full h-full px-4 rounded 
               transition-all duration-300 
               hover:bg-stone-200 
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stone-400"
      >
        <span
          class="text-2xl font-bold transition-all duration-300 whitespace-nowrap absolute left-4"
          :class="{
            'opacity-0 -translate-x-2 pointer-events-none': props.collapsed,
            'opacity-100 translate-x-0 pointer-events-auto': !props.collapsed
          }"
        >
          {{ label }}
        </span>

        <component
          :is="icon"
          class="transition-all duration-300"
          :class="props.collapsed ? 'w-14 h-14 mx-auto' : 'w-10 h-10 ml-auto'"
        />
      </button>
    </div>
  </div>
</template>
