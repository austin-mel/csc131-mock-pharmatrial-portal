<script setup lang="ts">
import { computed } from "vue";
import { SvgIcon as SVGIcons } from "@/assets";
import { useTrialsStore } from "@/stores";

const trials = useTrialsStore();
const demoMode = String(import.meta.env.VITE_DEMO_MODE ?? "false") === "true";
const apiConfigured = Boolean(
    (import.meta.env.VITE_API_URI ?? "").replace(/\/$/, ""),
);
const source = computed(() => {
    if (trials.apiHydrating) return null;
    if (!trials.apiFallback) return { kind: "api" } as const;
    return {
        kind: "seeded",
        reason: !demoMode && apiConfigured ? "backend-unavailable" : "demo-mode",
    } as const;
});

function reconnect() {
    window.location.reload();
}
</script>

<template>
    <div
        v-if="source"
        class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-porcelain px-4 py-3 text-xs"
        role="status"
    >
        <span v-if="source.kind === 'api'">
            Viewing live data · Connected to backend.
        </span>
        <span v-else>
            Viewing seeded sample data ·
            {{ source.reason === 'backend-unavailable' ? 'Backend unavailable. To save resources, the backend spins down after idling, after a request it takes ~1 minute to spin back up.' : 'Demo mode enabled.' }}
            Changes are saved only for this session.
        </span>
        <button
            v-if="source.kind === 'seeded' && source.reason === 'backend-unavailable'"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-[5px] border border-line bg-surface px-3 py-2 font-semibold hover:bg-porcelain"
            @click="reconnect"
        >
            <SVGIcons name="refresh" class="size-4" />
            Reconnect (reload samples)
        </button>
    </div>
</template>
