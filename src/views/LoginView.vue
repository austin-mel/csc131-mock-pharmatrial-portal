<script setup lang="ts">
import { LoginForm, Partnership } from "@/components";
</script>

<template>
  <div class="mt-[8rem] w-full flex justify-center">
    <div class="w-full max-w-md">
      <h1 class="mb-8 text-4xl font-extrabold text-center">
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

