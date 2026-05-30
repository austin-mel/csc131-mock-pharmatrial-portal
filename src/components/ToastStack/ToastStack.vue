<script setup lang="ts">
import { SvgIcon } from "@/assets";
import { useUiStore } from "@/stores";

const ui = useUiStore();

const toneClasses = {
  success: "border-[#1e7e4e]/30 bg-[#e6f4ec] text-[#1e7e4e]",
  error: "border-[#c0392b]/30 bg-[#fdf0ee] text-[#c0392b]",
  info: "border-[#2a5c8f]/30 bg-[#e8eef5] text-[#2a5c8f]",
} as const;
</script>

<template>
  <div
    v-if="ui.toasts.length"
    class="fixed bottom-4 right-4 z-[700] grid w-[min(360px,calc(100vw-32px))] gap-2"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      v-for="toast in ui.toasts"
      :key="toast.id"
      class="flex items-start gap-3 rounded-md border px-4 py-3 shadow-app-lg"
      :class="toneClasses[toast.type]"
      role="status"
    >
      <div class="min-w-0 flex-1 text-sm font-semibold leading-snug">
        {{ toast.message }}
      </div>
      <button
        class="grid size-6 shrink-0 place-items-center rounded border-0 bg-transparent opacity-70 hover:opacity-100"
        type="button"
        aria-label="Dismiss notification"
        @click="ui.dismissToast(toast.id)"
      >
        <SvgIcon name="close" />
      </button>
    </div>
  </div>
</template>
