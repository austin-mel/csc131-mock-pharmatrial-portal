<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { Sidebar } from "@/components/Sidebar";
const auth = useAuthStore()

</script>

<template>
    <div class="flex justify-start">
            <Sidebar v-if="auth.isLoggedIn" />
        </div>
    <div class="bg-white rounded-lg mx-[8rem] mt-[16rem] h-[calc(100vh-375px)] pb-4 shadow p-4">
        Dashboard
    </div>
</template>