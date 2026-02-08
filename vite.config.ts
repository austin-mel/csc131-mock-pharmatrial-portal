import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from your custom folder
  const env = loadEnv(mode, path.resolve(__dirname, "environment"));

  return {
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
      proxy: {
        "/api": {
          target: env.VITE_API_URI,
          changeOrigin: true,
        },
      },
    },
    define: {
      // Make env variables available in front-end
      "process.env": env,
    },
  };
});
