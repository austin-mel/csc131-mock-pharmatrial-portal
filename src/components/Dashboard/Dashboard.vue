<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { Sidebar, NewStudy } from "@/components";
const auth = useAuthStore()

</script>

<template>
    <div class="flex justify-start">
            <Sidebar v-if="auth.isLoggedIn" />
    </div>
    <div class="bg-white rounded-lg ml-[4rem] sm:mx-[8rem] mt-[4rem] sm:mt-[16rem] sm:h-[calc(100vh-375px)] shadow p-2">
        <NewStudy />
    </div>
</template>