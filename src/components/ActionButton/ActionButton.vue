<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'jh' | 'fda' | 'bav' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  block?: boolean;
}>(), { variant: 'ghost', type: 'button' });
const variantClasses = {
  primary: 'bg-[#1a1714] text-white',
  jh: 'bg-[#1e7e4e] text-white',
  fda: 'bg-[#2a5c8f] text-white',
  bav: 'bg-[#c0392b] text-white',
  ghost: 'border-[1.5px] border-[#dedad3] bg-transparent text-[#1a1714]',
  danger: 'bg-[#c0392b] text-white',
} as const;
</script>

<template>
  <button class="inline-flex items-center justify-center gap-[7px] whitespace-nowrap rounded-[5px] border-0 px-[18px] py-[9px] text-[13px] font-semibold transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-35" :class="[variantClasses[variant], { 'w-full': block }]" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
