<script setup lang="ts">
import { ref } from "vue";
import { SvgIcon } from "@/assets";
import { CreateTrialModal, TopNav, TrialSidebar } from "@/components";

const sidebarOpen = ref(false);
const createModalOpen = ref(false);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TopNav />
    <div class="relative flex h-[calc(100vh-56px)] flex-1 overflow-hidden">
      <button
        class="fixed left-3 top-[68px] z-[360] grid size-10 place-items-center rounded-md border border-rule bg-surface text-ink shadow-app md:hidden"
        type="button"
        aria-label="Open clinical trials menu"
        @click="sidebarOpen = true"
      >
        <SvgIcon name="menu" />
      </button>
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-[390] bg-black/35 md:hidden"
        @click="sidebarOpen = false"
      ></div>
      <TrialSidebar
        :open="sidebarOpen"
        @close="sidebarOpen = false"
        @create="createModalOpen = true"
      />
      <main
        class="flex flex-1 flex-col overflow-y-auto bg-bg"
        aria-label="Blank trial workspace"
      ></main>
    </div>
    <CreateTrialModal
      :open="createModalOpen"
      @close="createModalOpen = false"
    />
  </div>
</template>
