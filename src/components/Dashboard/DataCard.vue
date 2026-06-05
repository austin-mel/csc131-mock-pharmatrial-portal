<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
    <section
        class="mb-[18px] min-w-0 overflow-hidden rounded-md border border-rule bg-surface"
    >
        <header
            v-if="title || $slots.header"
            class="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-[18px] py-[13px] max-[640px]:px-4"
        >
            <div class="text-sm font-semibold">{{ title }}</div>
            <slot name="header" />
        </header>
        <slot />
    </section>
</template>
