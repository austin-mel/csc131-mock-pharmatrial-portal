<script setup lang="ts">
defineProps<{ label: string; sub?: string }>();
</script>

<template>
    <div
        class="min-w-0 rounded-md border border-rule bg-surface px-[17px] py-[15px] max-[640px]:px-4"
    >
        <div
            class="mb-1 font-mono text-[10px] uppercase tracking-[.12em] text-muted"
        >
            {{ label }}
        </div>
        <div
            class="break-words font-serif text-[28px] text-ink max-[640px]:text-[24px]"
        >
            <slot />
        </div>
        <div v-if="sub" class="mt-px text-[11px] text-muted">{{ sub }}</div>
    </div>
</template>
