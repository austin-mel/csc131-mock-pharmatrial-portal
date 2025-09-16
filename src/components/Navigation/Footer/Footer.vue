<script setup lang="ts">
import { ref } from "vue";
import { SocialLinks } from "../SocialLinks";

const current_year = ref(new Date().getFullYear());
</script>

<template>
  <footer class="w-full px-6 py-6 mt-auto">
        <div class="flex flex-col items-center justify-between mx-auto max-w-7xl sm:flex-row">
            <div class="mb-4 ml-12 text-xs sm:text-sm sm:mb-0">
                &copy; {{ current_year }} Austin Melendez. All Rights Reserved.
            </div>
            <div class="flex space-x-4">
                <SocialLinks />
            </div>
        </div>
    </footer>
</template>
