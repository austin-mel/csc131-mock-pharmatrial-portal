import { expect, it, vi } from "vitest";
import {
    mapPatientToDto,
    mapSnapshotDto,
    mapTrialToDto,
    type BackendSnapshotDto,
} from "@/api/dtoMappers";
import { appointment, patient, trial } from "./fixtures";

it("defaults absent DTO collections without losing provided data", () => {
    expect(mapSnapshotDto({} as BackendSnapshotDto)).toEqual({
        trials: [],
        patients: [],
        trialPatients: {},
        assignments: {},
        reports: {},
    });
    const snapshot = {
        trials: [trial()],
        patients: [patient()],
        trialPatients: {},
        assignments: {},
        reports: {},
    };
    expect(mapSnapshotDto(snapshot)).toEqual(snapshot);
    expect(mapPatientToDto(patient())).toEqual(patient());
    expect(mapTrialToDto(trial()).eligibility).toBeNull();
});
it("serializes every workflow endpoint with the correct method and body", async () => {
    vi.resetModules();
    vi.stubEnv("VITE_DEMO_MODE", "false");
    vi.stubEnv("VITE_API_URI", "https://api.example.test/api");
    const { pharmatrialApi: api } = await import("@/api/client");
    const assignments = {
        P1: {
            patientId: "P1",
            drug: "placebo" as const,
            trackingId: "PLC-001",
        },
    };
    const criteria = {
        includeIcd: ["J45"],
        excludeIcd: [],
        minAge: 18,
        incompatMeds: [],
    };
    const cases: Array<[() => Promise<unknown>, string, unknown, string?]> = [
        [
            () => api.createTrial({ name: "New" }),
            "/workflow/trials",
            { name: "New" },
        ],
        [
            () => api.approveTrial("T1", criteria),
            "/workflow/trials/T1/approve",
            { eligibility: criteria },
        ],
        [() => api.rejectTrial("T1"), "/workflow/trials/T1/reject", {}],
        [
            () => api.enrollPatient("T1", patient(), true),
            "/workflow/trials/T1/enrollments",
            { patient: patient(), eligible: true },
        ],
        [
            () =>
                api.importPatients("T1", [
                    { patient: patient(), eligible: false },
                ]),
            "/workflow/trials/T1/import-patients",
            { rows: [{ patient: patient(), eligible: false }] },
        ],
        [
            () => api.logAppointment("T1", "P1", appointment()),
            "/workflow/trials/T1/appointments",
            { patientId: "P1", appointment: appointment() },
        ],
        [
            () => api.submitBatch("T1", { batchRef: "LOT" }),
            "/workflow/trials/T1/batch",
            { batchRef: "LOT" },
        ],
        [
            () => api.saveAssignments("T1", assignments),
            "/workflow/trials/T1/assignments",
            { assignments },
        ],
        [() => api.notifyFda("T1"), "/workflow/trials/T1/notify-fda", {}],
        [
            () => api.discloseTrial("T1", [{ patientId: "P1" }]),
            "/workflow/trials/T1/disclosure",
            { reportRows: [{ patientId: "P1" }] },
        ],
        [
            () => api.archiveTrial("T1", true),
            "/workflow/trials/T1/archive",
            { archived: true },
        ],
        [
            () => api.deleteTrial("T1"),
            "/workflow/trials/T1",
            undefined,
            "DELETE",
        ],
    ];
    for (const [call, path, body, method = "POST"] of cases) {
        vi.mocked(fetch).mockResolvedValueOnce(Response.json({ saved: true }));
        await expect(call()).resolves.toEqual({ saved: true });
        expect(fetch).toHaveBeenLastCalledWith(
            `https://api.example.test/api${path}`,
            expect.objectContaining({
                method,
                ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            }),
        );
    }
});
it("preserves HTTP error details and suppresses repeated requests after a transport failure", async () => {
    vi.resetModules();
    vi.stubEnv("VITE_DEMO_MODE", "false");
    vi.stubEnv("VITE_API_URI", "https://api.example.test/api");
    const { pharmatrialApi: api, ApiError } = await import("@/api/client");
    vi.mocked(fetch).mockResolvedValueOnce(
        Response.json({ message: "Not permitted" }, { status: 403 }),
    );
    await expect(api.notifyFda("T1")).rejects.toEqual(
        new ApiError(403, "Not permitted"),
    );
    expect(api.fallbackActive).toBe(false);
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("offline"));
    await expect(api.snapshot()).rejects.toThrow("offline");
    await expect(api.snapshot()).rejects.toThrow("API fallback mode");
    expect(fetch).toHaveBeenCalledTimes(2);
});
