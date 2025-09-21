<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { CloseIcon } from '@/assets'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onEsc))
onUnmounted(() => document.removeEventListener('keydown', onEsc))
</script>

<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      @click.self="close"
    >
      <div class="relative bg-white rounded-lg shadow-lg p-4 left-8 w-auto sm:w-[35rem] z-50">
        <!-- Close button -->
        <button
          @click="close"
          class="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <CloseIcon class="w-5 h-5 text-gray-600" />
        </button>

        <slot />
      </div>
    </div>
  </transition>
</template>
