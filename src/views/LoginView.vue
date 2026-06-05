<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { LoginPanel } from "@/components";
import { useAuthStore } from "@/stores";
import { Routes } from "@/router";

const auth = useAuthStore();
const router = useRouter();

watch(
    () => auth.isLoggedIn,
    (isLoggedIn) => {
        if (isLoggedIn) router.replace({ name: Routes.DASHBOARD });
    },
    { immediate: true },
);
</script>

<template>
    <LoginPanel />
</template>
