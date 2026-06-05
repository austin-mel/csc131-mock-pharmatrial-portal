<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), {
    placeholder: "Search...",
});
const model = defineModel<string>({ default: "" });
</script>

<template>
    <input
        v-model="model"
        class="min-h-10 w-full min-w-0 rounded-[5px] border-[1.5px] border-rule bg-bg px-3 py-[7px] text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:text-xs"
        :placeholder="placeholder"
    />
</template>
