import { expect, it, vi } from "vitest";
import { createPinia } from "pinia";
import { trial, patient } from "./fixtures";

async function liveStores() {
    vi.resetModules();
    vi.stubEnv("VITE_DEMO_MODE", "false");
    vi.stubEnv("VITE_API_URI", "https://api.example.test/api");
    const pinia = createPinia();
    const { useTrialsStore, usePatientsStore } = await import("@/stores");
    return { trials: useTrialsStore(pinia), patients: usePatientsStore(pinia) };
}
it("replaces seeded data and picks a visible trial after API hydration", async () => {
    const { trials, patients } = await liveStores();
    const active = trial({ status: "active", assignmentsLocked: true });
    vi.mocked(fetch).mockResolvedValueOnce(
        Response.json({
            trials: [active],
            patients: [patient()],
            trialPatients: {},
            assignments: {},
        }),
    );
    expect(trials.apiHydrating).toBe(true);
    expect(await trials.hydrateFromApi()).toBe(true);
    expect(trials.trials).toEqual([active]);
    expect(patients.patients).toEqual([patient()]);
    expect(trials.currentTrialId).toBe(active.id);
    expect(trials.apiFallback).toBe(false);
    expect(trials.apiHydrating).toBe(false);
});
it.each(["reject", "pending"])(
    "retains seeds when the API is %s",
    async (mode) => {
        vi.useFakeTimers();
        const { trials } = await liveStores();
        const ids = trials.trials.map((t) => t.id);
        if (mode === "reject")
            vi.mocked(fetch).mockRejectedValue(new TypeError("offline"));
        else vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
        const pending = trials.hydrateFromApi(3000);
        await vi.advanceTimersByTimeAsync(3000);
        expect(await pending).toBe(false);
        expect(trials.trials.map((t) => t.id)).toEqual(ids);
        expect(trials.apiFallback).toBe(true);
        expect(trials.apiHydrating).toBe(false);
    },
);
