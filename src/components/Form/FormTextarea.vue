<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: "" });
const model = defineModel<string>();
</script>

<template>
    <textarea
        v-model="model"
        class="min-h-24 w-full min-w-0 resize-y rounded-[5px] border-[1.5px] border-rule bg-bg px-3 py-[9px] text-base text-ink focus:border-fda focus:bg-surface focus:outline-none sm:min-h-20 sm:text-[13px]"
        :placeholder="placeholder"
    />
</template>
