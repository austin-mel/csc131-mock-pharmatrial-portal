import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { createPinia } from "pinia";
import { createServer } from "vite";

let server;
let useAuthStore;
let api;
const originalFetch = globalThis.fetch;
const originalApiUri = process.env.VITE_API_URI;
const originalDemoMode = process.env.VITE_DEMO_MODE;

function success() {
    return Response.json({
        token: "test-token",
        user: { portalId: "jh-doctor", email: "doctor@jh.example", role: "Trial Physician" },
    });
}

before(async () => {
    process.env.VITE_API_URI = "https://api.example.test/api";
    process.env.VITE_DEMO_MODE = "false";
    server = await createServer({
        mode: "e2e",
        server: { middlewareMode: true, watch: null, ws: false },
    });
    ({ useAuthStore } = await server.ssrLoadModule("/src/stores/auth.store.ts"));
    ({ pharmatrialApi: api } = await server.ssrLoadModule("/src/api/client.ts"));
});

after(async () => {
    globalThis.fetch = originalFetch;
    if (originalApiUri === undefined) delete process.env.VITE_API_URI;
    else process.env.VITE_API_URI = originalApiUri;
    if (originalDemoMode === undefined) delete process.env.VITE_DEMO_MODE;
    else process.env.VITE_DEMO_MODE = originalDemoMode;
    await server?.close();
});

test("waits beyond the old three-second limit without logging in or showing an error", async () => {
    const auth = useAuthStore(createPinia());
    let complete;
    let calls = 0;
    globalThis.fetch = async (url, init) => {
        calls++;
        assert.equal(url, "https://api.example.test/api/auth/login");
        assert.equal(init.method, "POST");
        return new Promise((resolve, reject) => {
            complete = () => resolve(success());
            init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        });
    };
    const pending = auth.login();
    await delay(3200);
    assert.equal(auth.isLoggedIn, false);
    assert.equal(auth.error, null);
    assert.equal(calls, 1);
    complete();
    assert.equal(await pending, true);
    assert.equal(auth.isLoggedIn, true);
});

test("only a 401 response produces a password error", async () => {
    const auth = useAuthStore(createPinia());
    for (const status of [401, 404, 500, 503]) {
        globalThis.fetch = async () => new Response("Server error", { status });
        assert.equal(await auth.login(), false);
        assert.equal(auth.isLoggedIn, false);
        assert.equal(auth.error.includes("Invalid email or password"), status === 401);
    }
});

test("network failures use demo credentials and the next login retries the backend", async () => {
    const auth = useAuthStore(createPinia());
    let calls = 0;
    globalThis.fetch = async () => {
        calls++;
        if (calls === 1) throw new TypeError("Failed to fetch");
        return success();
    };
    assert.equal(await auth.login(), true);
    assert.equal(auth.isLoggedIn, true);
    assert.equal(auth.error, null);
    assert.equal(api.fallbackActive, true);
    assert.equal(api.demoLoginEnabled, false);
    auth.logout();
    assert.equal(await auth.login(), true);
    assert.equal(calls, 2);
    assert.equal(auth.error, null);
    assert.equal(api.fallbackActive, false);
});

test("a pending request waits 60 seconds before using demo login", async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const auth = useAuthStore(createPinia());
    globalThis.fetch = async (_url, init) => new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    });
    const pending = auth.login();
    t.mock.timers.tick(59_999);
    assert.equal(auth.error, null);
    assert.equal(auth.isLoggedIn, false);
    t.mock.timers.tick(1);
    assert.equal(await pending, true);
    assert.equal(auth.error, null);
    assert.equal(auth.isLoggedIn, true);
    assert.equal(api.fallbackActive, true);
    t.mock.timers.reset();
    auth.logout();
    globalThis.fetch = async () => success();
    assert.equal(await auth.login(), true);
});

test("connection fallback still rejects wrong passwords and credentials for another portal", async () => {
    const auth = useAuthStore(createPinia());
    globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
    assert.equal(await auth.login("doctor@jh.example", "wrong-password"), false);
    assert.equal(auth.isLoggedIn, false);
    auth.selectPortal("fda");
    assert.equal(await auth.login("doctor@jh.example", "jh-doctor-demo"), false);
    assert.equal(auth.isLoggedIn, false);
    assert.match(auth.error, /Invalid email or password/);
    assert.equal(await auth.login(), true);
    assert.equal(auth.error, null);
});

test("HTTP rejection after a connection outage does not allow demo login", async () => {
    const auth = useAuthStore(createPinia());
    globalThis.fetch = async () => new Response("Unauthorized", { status: 401 });
    assert.equal(await auth.login(), false);
    assert.equal(auth.isLoggedIn, false);
    assert.match(auth.error, /Invalid email or password/);
});

test("an earlier workflow outage cannot bypass a later live login", async () => {
    const auth = useAuthStore(createPinia());
    globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
    await assert.rejects(api.snapshot());
    assert.equal(api.fallbackActive, true);
    let calls = 0;
    globalThis.fetch = async () => { calls++; return success(); };
    assert.equal(await auth.login(), true);
    assert.equal(calls, 1);
    assert.equal(api.fallbackActive, false);
});
