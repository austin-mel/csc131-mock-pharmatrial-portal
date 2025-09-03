<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { type DrawerProps } from './drawer.props';


defineProps < DrawerProps > ();


const is_open = ref(false)

const toggle_drawer = () => {
    is_open.value = !is_open.value
}

const close_drawer = () => {
    is_open.value = false
}
</script>

<template>
    <div>
        <!-- Toggle button -->
        <button @click="toggle_drawer"
            class="fixed z-30 p-2 text-gray-800 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
            <MenuIcon v-if="!is_open" class="w-6 h-6" />
            <XIcon v-else class="w-6 h-6" />
        </button>

        <!-- Backdrop -->
        <div v-if="is_open" @click="close_drawer"
            class="fixed inset-0 z-40 transition-opacity duration-300 bg-black bg-opacity-50"
            :class="{ 'opacity-100': is_open, 'opacity-0': !is_open }"></div>

        <!-- Drawer -->
        <div class="fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out transform bg-white shadow-lg dark:bg-gray-800"
            :class="{
                '-translate-x-full': !is_open,
                'translate-x-0': is_open,
                'w-64 sm:w-80': true
            }">
            <div class="p-4">
                <h2 class="mb-4 text-2xl font-bold">{{ title }}</h2>
                <slot></slot>
            </div>
        </div>
    </div>
</template>