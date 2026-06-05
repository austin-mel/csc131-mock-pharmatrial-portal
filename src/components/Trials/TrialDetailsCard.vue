<script setup lang="ts">
import { DataCard, DetailGrid } from "@/components";

defineProps<{ items: Array<{ label: string; value: string | number }> }>();
</script>

<template>
    <DataCard title="Trial Details">
        <DetailGrid :items="items" />
    </DataCard>
</template>
