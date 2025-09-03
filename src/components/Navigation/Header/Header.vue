<script setup lang="ts">
import { BavariaLogo, JHLogo, FDALogo } from "@/assets";


import { Routes } from "@/router";
import { ref } from "vue";
</script>

<template>
    <header class="w-full flex justify-end">
        <img class="w-80 px-10 py-3 fixed" :src="JHLogo"></img>
    </header>
</template>
