<script setup lang="ts">
import { LoginForm, Partnership } from "@/components";
import Postit from "@/assets/postit.png";
</script>

<template>
  <div class="sm:mt-[8rem] w-full flex justify-center overflow-hidden">
    <div class="relative w-full max-w-md flex flex-col items-center">
      <img
        :src="Postit"
        alt="Postit"
        class="w-65 h-auto mb-4 relative sm:absolute top-10 sm:-right-100 sm:w-150 -rotate-15"
      />

      <h1 class="hidden sm:flex mb-8 text-4xl font-extrabold text-center">
        Pharmaceutical Trial Manager
      </h1>
      <div
        class="p-8 transition-transform transform bg-stone-100 rounded-lg shadow-xl bg-accent hover:scale-105"
      >
        <h2 class="mb-6 text-2xl font-bold text-gray-800 text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  </div>

  <div class="flex flex-col items-center justify-center bg-gray-50">
    <Partnership />
  </div>
</template>
