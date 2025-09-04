<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { Sidebar } from "@/components/Sidebar";
const auth = useAuthStore()

</script>

<template>
    <div class="flex justify-start">
            <Sidebar v-if="auth.isLoggedIn" />
        </div>
    <div class="bg-white rounded-lg ml-[20rem] mt-[16rem] pb-4 shadow h-[200vh] p-4">
        Dashboard
    </div>
</template>