<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@/assets'
import { Drawer } from '@/components'

const showModal = ref(false)
</script>

<template>
  <div>
    <button
      @click="showModal = true"
      class="relative flex items-center h-[3rem] px-4 rounded transition-all duration-300 hover:bg-stone-200"
    >
      <PlusIcon class="w-8 h-8" />
      <span class="px-4">Create New Study</span>
    </button>

    <Drawer v-model="showModal">
      <h2 class="text-xl font-bold mb-4">Create New Study</h2>
      <form class="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Study Name"
          class="border border-gray-300 p-2 rounded"
        />
        <button
          type="button"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click="showModal = false"
        >
          Create
        </button>
      </form>
    </Drawer>
  </div>
</template>
