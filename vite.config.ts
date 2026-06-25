import path from "node:path";
import fs from "node:fs";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

function loadCustomEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        if (index < 0) return [line, ""];

        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "environment");
  // Load environment variables from your custom folder
  const env = {
    ...loadEnv(mode, envDir),
    ...loadCustomEnvFile(path.resolve(envDir, ".front-end.env")),
  };

  return {
    envDir,
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
      "import.meta.env.VITE_API_URI": JSON.stringify(env.VITE_API_URI ?? ""),
      "import.meta.env.VITE_DEMO_MODE": JSON.stringify(
        env.VITE_DEMO_MODE ?? "false",
      ),
    },
  };
});
