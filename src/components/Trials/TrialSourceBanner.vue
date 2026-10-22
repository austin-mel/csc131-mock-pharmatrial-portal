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
            class="ui-button"
            @click="reconnect"
        >
            <SVGIcons name="refresh" class="size-4" />
            Reconnect (reload samples)
        </button>
    </div>
</template>

<style scoped>
.ui-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 1px solid #dedad3;
    border-radius: 5px;
    background: #fff;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
}

.ui-button:hover {
    background: #f5f2ec;
}
</style>
