<script setup lang="ts">
import { SvgIcon } from "@/assets";

defineProps<{ open: boolean; title: string; wide?: boolean }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(20,18,16,.52)]"
    @click.self="$emit('close')"
  >
    <section
      class="max-h-[90vh] w-[580px] max-w-[95vw] overflow-auto rounded-lg bg-white shadow-[0_8px_48px_rgba(0,0,0,.15)]"
      :class="{ 'w-[740px]': wide }"
    >
      <header
        class="flex items-center justify-between border-b border-[#dedad3] px-[22px] py-[17px]"
      >
        <h2 class="font-['DM_Serif_Display',serif] text-[19px] font-normal">
          {{ title }}
        </h2>
        <button
          class="grid size-8 place-items-center border-0 bg-transparent text-[#6b6560] hover:text-[#1a1714]"
          aria-label="Close"
          @click="$emit('close')"
        >
          <SvgIcon name="close" />
        </button>
      </header>
      <main class="p-[22px]">
        <slot />
      </main>
      <footer
        v-if="$slots.footer"
        class="flex justify-end gap-2.5 border-t border-[#dedad3] px-[22px] py-[13px]"
      >
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>
