<script setup lang="ts">
import { LogoutIcon } from '@/assets/icons'

defineProps<{
  collapsed: boolean
}>();
</script>

<template>
  <div class="mb-2 mt-auto pb-4">
    <button
      class="relative flex items-center w-full h-16 px-4 rounded transition-all duration-300 hover:bg-stone-200">
      <span
        class="text-2xl text-red-600 font-bold transition-all duration-300 whitespace-nowrap absolute left-4"
        :class="{
          'opacity-0 -translate-x-2 pointer-events-none': collapsed,
          'opacity-100 translate-x-0 pointer-events-auto': !collapsed
        }">
        Logout
      </span>

            <LogoutIcon
        :class="[
          'transition-all duration-300',
          collapsed ? 'w-10 h-10 mx-auto text-red-600' : 'w-8 h-8 ml-auto text-red-600'
        ]"
      />
    </button>
  </div>
</template>
