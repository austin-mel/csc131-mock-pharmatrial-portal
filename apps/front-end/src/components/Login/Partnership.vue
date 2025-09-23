<script setup lang="ts">
import { BavariaLogo, JHLogo, FDALogo } from "@/assets";

const logoMap: Record<string, string> = {
  Bavaria: BavariaLogo,
  JH: JHLogo,
  FDA: FDALogo,
};

const baseLogos = ["Bavaria", "JH", "FDA"];

// Repeat logos 100 times for a continuous effect
const logos = Array(100).fill(baseLogos).flat();
</script>

<template>
  <div class="w-full pt-8 overflow-hidden bg-stone-100">
    <h2 class="text-xl text-center mb-6">In Partnership With</h2>

    <div class="relative w-full overflow-hidden">
      <div class="flex animate-marquee gap-12">
        <div
          v-for="(logoKey, idx) in logos"
          :key="idx"
          class="w-24 h-24 mx-24 flex"
        >
          <img
            :src="logoMap[logoKey]"
            :alt="`${logoKey} Logo`"
            class="object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 2000s linear infinite;
}
</style>
