<script setup lang="ts">
import { links } from './links.data';
</script>

<template>
    <a
        v-for="(link, index) in links"
        :key="index"
        :href="link.href"
        target="_blank"
        class="p-5">        
        <component :is="link.icon" class="w-5 h-5" />
            <span class="sr-only">{{ link.name }}</span>
    </a>
</template>