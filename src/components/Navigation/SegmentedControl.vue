<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ options: Array<{ label: string; value: string }> }>();

const model = defineModel<string>({ required: true });

const activeIndex = computed(() =>
    props.options.findIndex((option) => option.value === model.value),
);

const checked = computed(() => activeIndex.value === 1);

const switchLabel = computed(() => {
    const activeOption = props.options[activeIndex.value];

    return activeOption ? `Showing ${activeOption.label}` : "Trial filter";
});

function toggle() {
    const nextOption = props.options[checked.value ? 0 : 1];

    if (nextOption) model.value = nextOption.value;
}
</script>

<template>
    <button
        class="relative grid h-9 w-full grid-cols-2 items-center overflow-hidden rounded-full border border-rule bg-bg p-1 font-mono text-[10px] shadow-inner transition-colors hover:border-ink/45 focus:outline-none focus:ring-2 focus:ring-ink/25"
        type="button"
        role="switch"
        :aria-checked="checked"
        :aria-label="switchLabel"
        @click="toggle"
    >
        <span
            class="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink shadow-sm transition-transform duration-200"
            :class="checked ? 'translate-x-full' : 'translate-x-0'"
        />
        <span
            v-for="option in options"
            :key="option.value"
            class="relative z-10 min-w-0 truncate px-2 text-center transition-colors"
            :class="model === option.value ? 'text-white' : 'text-muted'"
        >
            {{ option.label }}
        </span>
    </button>
</template>
