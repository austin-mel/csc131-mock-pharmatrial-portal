<script setup lang="ts">
import { ref } from "vue";

import { SvgIcon } from "@/assets";

defineProps<{ open: boolean; title: string; wide?: boolean }>();
const emit = defineEmits<{ close: [] }>();

const pointerStartedOnBackdrop = ref(false);

function onBackdropPointerDown(event: PointerEvent) {
  pointerStartedOnBackdrop.value = event.target === event.currentTarget;
}

function onBackdropPointerUp(event: PointerEvent) {
  const endedOnBackdrop = event.target === event.currentTarget;
  if (pointerStartedOnBackdrop.value && endedOnBackdrop) emit("close");
  pointerStartedOnBackdrop.value = false;
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[500] flex items-end justify-center bg-[rgba(20,18,16,.52)] p-0 sm:items-center sm:p-4"
    @pointerdown="onBackdropPointerDown"
    @pointerup="onBackdropPointerUp"
  >
    <section
      class="flex max-h-[94dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-lg bg-surface shadow-app-lg sm:max-h-[90dvh] sm:w-[580px] sm:max-w-[95vw] sm:rounded-lg"
      :class="{ 'sm:w-[740px]': wide }"
    >
      <header
        class="flex shrink-0 items-center justify-between gap-3 border-b border-rule px-4 py-4 sm:px-[22px] sm:py-[17px]"
      >
        <h2 class="min-w-0 break-words font-serif text-[19px] font-normal leading-tight text-ink">
          {{ title }}
        </h2>
        <button
          class="grid size-9 shrink-0 place-items-center rounded border-0 bg-transparent text-muted hover:bg-bg hover:text-ink"
          aria-label="Close"
          @click="$emit('close')"
        >
          <SvgIcon name="close" />
        </button>
      </header>
      <main class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-[22px]">
        <slot />
      </main>
      <footer
        v-if="$slots.footer"
        class="flex shrink-0 flex-col-reverse gap-2.5 border-t border-rule px-4 py-[13px] sm:flex-row sm:justify-end sm:px-[22px]"
      >
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>
