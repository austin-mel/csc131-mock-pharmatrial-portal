import { beforeEach, expect, it, vi } from "vitest";
import { createPinia } from "pinia";
import type { PortalId } from "@/types";

async function load(demo = false) {
    vi.resetModules();
    vi.stubEnv("VITE_DEMO_MODE", String(demo));
    vi.stubEnv("VITE_API_URI", "https://api.example.test/api/");
    const { useAuthStore } = await import("@/stores/auth.store");
    const client = await import("@/api/client");
    return { auth: useAuthStore(createPinia()), ...client };
}
function success() {
    return Response.json({
        token: "test-token",
        user: { portalId: "jh-doctor" },
    });
}
beforeEach(() => vi.useFakeTimers());

it.each<PortalId>(["jh-doctor", "jh-admin", "fda", "bavaria"])(
    "supports demo login and logout for %s without requests",
    async (role) => {
        const { auth } = await load(true);
        expect(auth.currentPortal).toBeNull();
        auth.selectPortal(role);
        expect(await auth.login()).toBe(true);
        expect(auth.currentPortal?.id).toBe(role);
        auth.logout();
        expect(auth.isLoggedIn).toBe(false);
        expect(auth.error).toBeNull();
        expect(fetch).not.toHaveBeenCalled();
    },
);
it("normalizes demo email while rejecting wrong passwords and wrong-portal credentials", async () => {
    const { auth } = await load(true);
    expect(await auth.login(" DOCTOR@JH.EXAMPLE ", "jh-doctor-demo")).toBe(
        true,
    );
    expect(await auth.login("doctor@jh.example", "wrong")).toBe(false);
    auth.selectPortal("fda");
    expect(await auth.login("doctor@jh.example", "jh-doctor-demo")).toBe(false);
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.error).toMatch(/Invalid email/);
});
it("waits beyond three seconds and sends the selected portal and credentials", async () => {
    const { auth } = await load();
    let resolve!: (value: Response) => void;
    vi.mocked(fetch).mockImplementation(
        () =>
            new Promise((r) => {
                resolve = r;
            }),
    );
    const pending = auth.login();
    await vi.advanceTimersByTimeAsync(3200);
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
        "https://api.example.test/api/auth/login",
        expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
                portalId: "jh-doctor",
                email: "doctor@jh.example",
                password: "jh-doctor-demo",
            }),
        }),
    );
    resolve(success());
    expect(await pending).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
});
it.each([401, 403, 404, 500, 503])(
    "does not fall back to demo credentials on HTTP %s",
    async (status) => {
        const { auth } = await load();
        vi.mocked(fetch).mockResolvedValue(
            new Response("not json", { status }),
        );
        expect(await auth.login()).toBe(false);
        expect(auth.isLoggedIn).toBe(false);
        expect(auth.error).toBe(
            status === 401
                ? "Invalid email or password for selected portal!"
                : "The sign-in service returned an error. Please try again.",
        );
    },
);
it("falls back only for transport errors and retries the backend after logout", async () => {
    const { auth, pharmatrialApi: api } = await load();
    vi.mocked(fetch)
        .mockRejectedValueOnce(new TypeError("offline"))
        .mockResolvedValueOnce(success());
    expect(await auth.login()).toBe(true);
    expect(api.fallbackActive).toBe(true);
    expect(api.demoLoginEnabled).toBe(false);
    auth.logout();
    expect(await auth.login()).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(api.fallbackActive).toBe(false);
});
it("aborts after exactly 60 seconds and still validates fallback credentials", async () => {
    const { auth, pharmatrialApi: api } = await load();
    vi.mocked(fetch).mockImplementation(
        (_url, init) =>
            new Promise((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () =>
                    reject(new DOMException("Aborted", "AbortError")),
                );
            }),
    );
    const pending = auth.login();
    await vi.advanceTimersByTimeAsync(59_999);
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.error).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(await pending).toBe(true);
    expect(api.fallbackActive).toBe(true);
    auth.logout();
    vi.mocked(fetch).mockRejectedValue(new TypeError("offline"));
    expect(await auth.login("doctor@jh.example", "wrong")).toBe(false);
});
it("does not let an earlier workflow outage bypass a later HTTP login rejection", async () => {
    const { auth, pharmatrialApi: api } = await load();
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("offline"));
    await expect(api.snapshot()).rejects.toThrow("offline");
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
    expect(await auth.login()).toBe(false);
    expect(auth.error).toMatch(/Invalid email/);
});
it("sends bearer tokens on workflow requests and clears them on logout", async () => {
    const { auth, pharmatrialApi: api } = await load();
    vi.mocked(fetch)
        .mockResolvedValueOnce(success())
        .mockResolvedValueOnce(Response.json({}))
        .mockResolvedValueOnce(new Response(null, { status: 204 }));
    await auth.login();
    expect(await api.snapshot()).toEqual({
        trials: [],
        patients: [],
        trialPatients: {},
        assignments: {},
        reports: {},
    });
    expect(vi.mocked(fetch).mock.calls[1][1]?.headers).toMatchObject({
        Authorization: "Bearer test-token",
    });
    auth.logout();
    expect(await api.deleteTrial("T1")).toBeUndefined();
    expect(vi.mocked(fetch).mock.calls[2][1]?.headers).not.toHaveProperty(
        "Authorization",
    );
});
