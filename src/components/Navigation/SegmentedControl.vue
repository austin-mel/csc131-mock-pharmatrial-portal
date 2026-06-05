<script setup lang="ts">
defineProps<{ options: Array<{ label: string; value: string }> }>();

const model = defineModel<string>({ required: true });
</script>

<template>
    <div class="grid auto-cols-fr grid-flow-col gap-1.5">
        <button
            v-for="option in options"
            :key="option.value"
            class="rounded-[5px] border px-2 py-1.5 font-mono text-[10px]"
            type="button"
            :class="
                model === option.value
                    ? 'border-ink bg-ink text-white'
                    : 'border-rule bg-bg text-muted'
            "
            @click="model = option.value"
        >
            {{ option.label }}
        </button>
    </div>
</template>
