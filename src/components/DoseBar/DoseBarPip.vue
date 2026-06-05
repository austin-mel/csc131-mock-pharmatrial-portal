<script setup lang="ts">
defineProps<{ filled?: boolean; complete?: boolean }>();
</script>

<template>
    <span
        class="inline-block size-2.5 rounded-sm"
        :class="filled ? (complete ? 'bg-jh' : 'bg-fda') : 'bg-rule'"
    />
</template>
