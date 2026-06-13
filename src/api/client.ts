import { mapPatientToDto, mapSnapshotDto, type BackendSnapshotDto } from "./dtoMappers";
import type {
    AppointmentDraft,
    Patient,
    PortalId,
    TrialAssignmentMap,
    TrialEligibility,
} from "@/types";

const apiUri = (import.meta.env.VITE_API_URI ?? "").replace(/\/$/, "");
const demoMode = String(import.meta.env.VITE_DEMO_MODE ?? "false") === "true";

let authToken: string | null = null;
let apiUnavailable = false;

export function isDemoMode() {
    return demoMode || !apiUri || apiUnavailable;
}

export function setAuthToken(token: string | null) {
    authToken = token;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (isDemoMode()) throw new Error("API fallback mode is enabled.");

    const response = await fetch(`${apiUri}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...init.headers,
        },
    }).catch((error) => {
        apiUnavailable = true;
        throw error;
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "API request failed.");
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

export const pharmatrialApi = {
    get fallbackActive() {
        return isDemoMode();
    },

    async login(portalId: PortalId, email: string, password: string) {
        const result = await request<{
            token: string;
            user: { portalId: PortalId; email: string; role: string };
        }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ portalId, email, password }),
        });
        setAuthToken(result.token);
        return result;
    },

    async snapshot() {
        return mapSnapshotDto(await request<BackendSnapshotDto>("/workflow/snapshot"));
    },

    async createTrial(draft: unknown) {
        return request("/workflow/trials", {
            method: "POST",
            body: JSON.stringify(draft),
        });
    },

    async approveTrial(trialId: string, eligibility?: TrialEligibility) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/approve`, {
            method: "POST",
            body: JSON.stringify({ eligibility }),
        });
    },

    async rejectTrial(trialId: string) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/reject`, {
            method: "POST",
            body: JSON.stringify({}),
        });
    },

    async enrollPatient(trialId: string, patient: Patient, eligible: boolean) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/enrollments`, {
            method: "POST",
            body: JSON.stringify({
                patient: mapPatientToDto(patient),
                eligible,
            }),
        });
    },

    async importPatients(
        trialId: string,
        rows: Array<{ patient: Patient; eligible: boolean }>,
    ) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/import-patients`, {
            method: "POST",
            body: JSON.stringify({
                rows: rows.map((row) => ({
                    patient: mapPatientToDto(row.patient),
                    eligible: row.eligible,
                })),
            }),
        });
    },

    async logAppointment(
        trialId: string,
        patientId: string,
        appointment: AppointmentDraft,
    ) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/appointments`, {
            method: "POST",
            body: JSON.stringify({ patientId, appointment }),
        });
    },

    async submitBatch(trialId: string, draft: unknown) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/batch`, {
            method: "POST",
            body: JSON.stringify(draft),
        });
    },

    async saveAssignments(trialId: string, assignments: TrialAssignmentMap) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/assignments`, {
            method: "POST",
            body: JSON.stringify({ assignments }),
        });
    },

    async notifyFda(trialId: string) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/notify-fda`, {
            method: "POST",
            body: JSON.stringify({}),
        });
    },

    async discloseTrial(trialId: string, reportRows: unknown[] = []) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/disclosure`, {
            method: "POST",
            body: JSON.stringify({ reportRows }),
        });
    },

    async archiveTrial(trialId: string, archived: boolean) {
        return request<BackendSnapshotDto>(`/workflow/trials/${trialId}/archive`, {
            method: "POST",
            body: JSON.stringify({ archived }),
        });
    },

    async deleteTrial(trialId: string) {
        return request<{ deleted: string }>(`/workflow/trials/${trialId}`, {
            method: "DELETE",
        });
    },
};
