import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@/assets": path.resolve(__dirname, "src/assets"),
            "@/components": path.resolve(__dirname, "src/components"),
            "@/functions": path.resolve(__dirname, "src/functions"),
            "@/plugins": path.resolve(__dirname, "src/plugins"),
            "@/router": path.resolve(__dirname, "src/router"),
            "@/services": path.resolve(__dirname, "src/services"),
            "@/stores": path.resolve(__dirname, "src/stores"),
            "@/types": path.resolve(__dirname, "src/types"),
            "@/views": path.resolve(__dirname, "src/views"),
        },
    },
    server: {
        // host: "0.0.0.0",
        // port: 5173,
        proxy: {
            "/api": {
                target: process.env.VITE_API_URI,
                changeOrigin: true,
            },
        },
    },
});
