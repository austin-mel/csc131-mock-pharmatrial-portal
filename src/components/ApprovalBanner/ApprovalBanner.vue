<script setup lang="ts">
import { SvgIcon } from "@/assets";

defineProps<{ count: number }>();
defineEmits<{ jump: [] }>();
</script>

<template>
    <div
        v-if="count"
        class="flex min-h-[76px] flex-col items-stretch justify-between gap-3 border-b-4 border-bav bg-bav px-4 py-4 text-white shadow-[0_8px_24px_rgba(192,57,43,.35)] sm:flex-row sm:items-center sm:px-7"
    >
        <div class="flex min-w-0 items-center gap-4">
            <span
                class="grid size-11 shrink-0 place-items-center rounded-full border-2 border-white/70 bg-white/15 text-xl font-bold shadow-[0_3px_10px_rgba(0,0,0,.18)]"
            >
                <SvgIcon name="error" />
            </span>
            <div class="min-w-0">
                <div
                    class="font-mono text-[11px] font-bold uppercase tracking-[.16em] text-white/75"
                >
                    Action Required
                </div>
                <div
                    class="mt-0.5 text-xl font-black leading-tight max-[640px]:text-base"
                >
                    {{ count }}
                    {{
                        count === 1 ? "trial requires" : "trials require"
                    }}
                    immediate review
                </div>
            </div>
        </div>
        <button
            class="min-h-10 shrink-0 rounded-[5px] border-2 border-white bg-surface px-5 py-2.5 text-sm font-black uppercase tracking-[.08em] text-bav shadow-[0_3px_10px_rgba(0,0,0,.18)] transition-[opacity,transform] hover:opacity-90 active:scale-[.98] max-[520px]:w-full max-[520px]:px-3 max-[520px]:text-xs"
            type="button"
            @click="$emit('jump')"
        >
            View Trial
        </button>
    </div>
</template>
