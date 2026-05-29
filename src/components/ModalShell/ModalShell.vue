<script setup lang="ts">
import { SvgIcon } from "@/assets";

defineProps<{ open: boolean; title: string; wide?: boolean }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[500] flex items-end justify-center bg-[rgba(20,18,16,.52)] p-0 sm:items-center sm:p-4"
    @click.self="$emit('close')"
  >
    <section
      class="max-h-[94vh] w-full overflow-auto rounded-t-lg bg-white shadow-[0_8px_48px_rgba(0,0,0,.15)] sm:max-h-[90vh] sm:w-[580px] sm:max-w-[95vw] sm:rounded-lg"
      :class="{ 'sm:w-[740px]': wide }"
    >
      <header
        class="flex items-center justify-between gap-3 border-b border-[#dedad3] px-4 py-4 sm:px-[22px] sm:py-[17px]"
      >
        <h2 class="min-w-0 font-['DM_Serif_Display',serif] text-[19px] font-normal">
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
      <main class="p-4 sm:p-[22px]">
        <slot />
      </main>
      <footer
        v-if="$slots.footer"
        class="flex flex-col-reverse gap-2.5 border-t border-[#dedad3] px-4 py-[13px] sm:flex-row sm:justify-end sm:px-[22px]"
      >
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>
