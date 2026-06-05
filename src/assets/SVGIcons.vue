<script setup lang="ts">
const paths = {
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z",
    arrowBack: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2Z",
    arrowForward:
        "m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8Z",
    check: "m9 16.17-4.17-4.17-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z",
    close: "M18.3 5.71 16.89 4.3 12 9.17 7.11 4.3 5.7 5.71 10.59 10.6 5.7 15.49l1.41 1.41L12 12.01l4.89 4.89 1.41-1.41-4.89-4.89 4.89-4.89Z",
    error: "M11 15h2v2h-2v-2Zm0-8h2v6h-2V7Zm1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z",
    menu: "M3 18h18v-2H3v2Zm0-5h18v-2H3v2Zm0-7v2h18V6H3Z",
    science:
        "M19.8 18.4 14 10.67V5h1V3H9v2h1v5.67L4.2 18.4A2 2 0 0 0 5.8 21h12.4a2 2 0 0 0 1.6-2.6ZM7 19l5-6.67L17 19H7Z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 9h8v10H8V9Zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5Z",
    uploadFile:
        "M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Zm-2 9v-4H8l4-4 4 4h-3v4h-2Z",
} as const;

defineProps<{ name: keyof typeof paths }>();
</script>

<template>
    <svg
        class="app-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
    >
        <path :d="paths[name]" />
    </svg>
</template>
