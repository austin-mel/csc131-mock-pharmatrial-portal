<script setup lang="ts">
type StatusBadgeTone =
  | "gray"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "red"
  | "purple"
  | "black"
  | "cyan";

withDefaults(defineProps<{ tone?: StatusBadgeTone }>(), { tone: "gray" });

const toneClasses: Record<StatusBadgeTone, string> = {
  gray: "bg-[#f0ede8] text-[#6b6560]",
  green: "bg-[#e6f4ec] text-[#1e7e4e]",
  blue: "bg-[#e8eef5] text-[#2a5c8f]",
  yellow: "bg-[#fdf6e3] text-[#b8860b]",
  orange: "bg-[#fff0e6] text-[#c0550a]",
  red: "bg-[#fdf0ee] text-[#c0392b]",
  purple: "bg-[#7c3aed] text-white",
  black: "bg-[#1a1714] text-white",
  cyan: "bg-[#d9fbff] text-[#087386]",
};
</script>

<template>
  <span
    class="inline-block rounded-[20px] px-[9px] py-0.5 font-['DM_Mono',monospace] text-[11px] font-semibold"
    :class="toneClasses[tone]"
  >
    <slot />
  </span>
</template>
