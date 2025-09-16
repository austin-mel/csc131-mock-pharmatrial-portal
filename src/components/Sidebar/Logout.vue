<script setup lang="ts">
import { LogoutIcon } from '@/assets/icons'

defineProps<{
  collapsed: boolean
}>();
</script>

<template>
  <div class="w-full sm:border-t border-stone-300 mt-2">
    <button
      class="relative flex items-center w-full h-[5rem] px-4 rounded transition-all duration-300 hover:bg-stone-200"
      :class="collapsed ? 'justify-center' : 'justify-start'">
      <span
        class="text-2xl font-bold text-red-600 transition-all duration-300 whitespace-nowrap absolute left-4"
        :class="{
          'opacity-0 -translate-x-2 pointer-events-none': collapsed,
          'opacity-100 translate-x-0 pointer-events-auto': !collapsed
        }">
        Logout
      </span>

      <LogoutIcon
        :class="[
          'transition-all duration-300 text-red-600',
          collapsed ? 'w-14 h-14 mx-auto' : 'w-10 h-10 ml-auto'
        ]"/>
    </button>
  </div>
</template>
