<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="mb-[18px] overflow-hidden rounded-md border border-[#dedad3] bg-white">
    <header
      v-if="title || $slots.header"
      class="flex flex-wrap items-center justify-between gap-2 border-b border-[#dedad3] px-[18px] py-[13px]"
    >
      <div class="text-sm font-semibold">{{ title }}</div>
      <slot name="header" />
    </header>
    <slot />
  </section>
</template>
