import { defineConfig, devices } from "playwright/test";

const port = 4174;
const browserChannel = process.env.PLAYWRIGHT_BROWSER_CHANNEL;
const chromiumChannel = browserChannel ? { channel: browserChannel } : {};

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    reporter: [["list"], ["html", { open: "never" }]],
    outputDir: "test-results",
    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    webServer: {
        command: `node ./node_modules/vite/bin/vite.js --mode e2e --host 127.0.0.1 --port ${port}`,
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: false,
        timeout: 60_000,
        env: {
            VITE_DEMO_MODE: "true",
            VITE_API_URI: "",
        },
    },
    projects: [
        {
            name: "desktop-chromium",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 900 },
                ...chromiumChannel,
            },
        },
        {
            name: "tablet-chromium",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 768, height: 1024 },
                hasTouch: true,
                ...chromiumChannel,
            },
        },
        {
            name: "mobile-chromium",
            use: {
                ...devices["Pixel 5"],
                ...chromiumChannel,
            },
        },
    ],
});
