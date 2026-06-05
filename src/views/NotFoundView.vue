<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Routes } from "@/router";
</script>

<template>
    <main class="grid min-h-screen place-items-center bg-bg px-4 text-ink">
        <section class="text-center">
            <p
                class="font-mono text-[11px] uppercase tracking-[.14em] text-muted"
            >
                Page Not Found
            </p>
            <RouterLink
                class="mt-3 inline-block rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
                :to="{ name: Routes.LOGIN }"
            >
                Return to Sign In
            </RouterLink>
        </section>
    </main>
</template>
