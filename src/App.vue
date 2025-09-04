<script setup lang="ts">
import { RouterView } from "vue-router";
import { provide, ref } from "vue";

import { Navigation } from "@/components";
</script>

<template>
  <Navigation >
    <main class="bg-stone-100">
      <RouterView />
    </main>
  </Navigation>
</template>
