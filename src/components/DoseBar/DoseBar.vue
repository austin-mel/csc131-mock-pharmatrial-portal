<script setup lang="ts">
import { DoseBarPip } from "@/components";
import { computed } from "vue";

const props = defineProps<{ doses: number; total: number }>();
const complete = computed(() => props.total > 0 && props.doses >= props.total);
</script>

<template>
    <div class="flex items-center gap-[3px]">
        <DoseBarPip
            v-for="i in total"
            :key="i"
            :filled="i <= doses"
            :complete="complete"
        />
        <span class="ml-[5px] text-[11px] text-muted"
            >{{ doses }}/{{ total }}</span
        >
    </div>
</template>
