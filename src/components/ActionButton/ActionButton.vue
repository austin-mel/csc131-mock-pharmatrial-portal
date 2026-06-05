<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "jh" | "fda" | "bav" | "ghost" | "danger";
    type?: "button" | "submit";
    disabled?: boolean;
    block?: boolean;
  }>(),
  { variant: "ghost", type: "button" },
);
const variantClasses = {
  primary: "bg-ink text-white",
  jh: "bg-jh text-white",
  fda: "bg-fda text-white",
  bav: "bg-bav text-white",
  ghost: "border-[1.5px] border-rule bg-transparent text-ink",
  danger: "bg-bav text-white",
} as const;
</script>

<template>
  <button
    class="inline-flex min-h-10 min-w-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-[5px] border-0 px-4 py-[9px] text-[13px] font-semibold transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-35 max-[420px]:w-full max-[420px]:px-3"
    :class="[variantClasses[variant], { 'w-full': block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
