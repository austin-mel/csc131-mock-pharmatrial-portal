<script setup lang="ts">
import { ActionButton } from "@/components";
import { SvgIcon } from "@/assets";

defineProps<{ page: number; pages: number }>();
defineEmits<{ change: [delta: number] }>();
</script>

<template>
    <div class="flex min-w-0 flex-col items-stretch">
        <div
            class="flex flex-row items-center justify-between gap-1.5"
            data-testid="pagination-buttons"
        >
            <ActionButton :disabled="page <= 1" @click="$emit('change', -1)">
                <SvgIcon name="arrowBack" />
                Prev
            </ActionButton>
            <ActionButton :disabled="page >= pages" @click="$emit('change', 1)">
                Next
                <SvgIcon name="arrowForward" />
            </ActionButton>
        </div>
        <span
            class="mt-1.5 shrink-0 text-center font-['DM_Mono',monospace] text-[10px] text-muted"
            data-testid="pagination-label"
        >
            Page {{ page }}/{{ pages }}
        </span>
    </div>
</template>
