import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Deliberately independent of Vite's local environment loader: tests never use a real API.
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        include: ["tests/unit/**/*.test.ts"],
        environment: "jsdom",
        setupFiles: ["./tests/unit/setup.ts"],
        env: { VITE_DEMO_MODE: "true", VITE_API_URI: "" },
        clearMocks: true,
        restoreMocks: true,
        unstubGlobals: true,
        unstubEnvs: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            include: ["src/**/*.ts", "src/**/*.vue"],
            exclude: [
                "src/**/index.ts",
                "src/types/**",
                "src/data/**",
                "src/assets/**",
                "src/main.ts",
            ],
            thresholds: {
                statements: 80,
                lines: 80,
                branches: 70,
                functions: 75,
            },
        },
    },
});
