<script setup lang="ts">
import { BavariaLogo } from "@/assets";
import { Routes } from "@/router";
import { ref } from "vue";
</script>

<template>
    <header class="w-full flex px-6 py-4 bg-primary-400 shadow-md dark:bg-primary-900">
        <img class="w-24 justify-end" :src="BavariaLogo"></img>
    </header>
</template>
