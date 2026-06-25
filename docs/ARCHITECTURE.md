# Architecture Reference

## Summary

Pharmatrial is a Vue 3 single-page application backed by a live workflow API. The frontend owns presentation, role-specific navigation, privacy-aware display, optimistic UI state, and seeded fallback data. The backend is the source of truth in live mode.

When `VITE_API_URI` is configured and `VITE_DEMO_MODE` is not `true`, the app authenticates against the backend, fetches a workflow snapshot, and syncs workflow actions through API endpoints. When live data cannot be used, the same Pinia stores initialize from seeded TypeScript modules in `src/data`.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript |
| Build tool | Vite |
| State management | Pinia |
| Routing | Vue Router |
| Styling | Tailwind CSS, Flowbite, Flowbite Vue |
| API integration | Native `fetch` client in `src/api/client.ts` |
| Fallback data | TypeScript modules in `src/data` |

## Runtime Configuration

Environment variables are loaded from the `environment` directory. The Vite config also reads `environment/.front-end.env` directly so local setup can keep frontend settings separate from the project root.

| Variable | Required | Description |
|---|---:|---|
| `VITE_API_URI` | Live mode: yes | Base URL for the backend API. A trailing slash is trimmed by the client. |
| `VITE_DEMO_MODE` | No | Set to `true` to force seeded fallback mode even when `VITE_API_URI` is set. |

## Application Flow

1. User opens `/`.
2. `LoginView` lets the user select a portal.
3. `auth.store.ts` attempts backend login when live mode is active.
4. Backend login calls `POST /auth/login` and stores the returned bearer token in memory.
5. If backend login is unavailable because fallback mode is active, the store validates seeded demo credentials.
6. Authenticated users enter `/dashboard`.
7. `DashboardView` calls `trials.hydrateFromApi()` on mount.
8. Live mode loads `GET /workflow/snapshot`; fallback mode keeps seeded Pinia state.
9. Trial tabs and actions are filtered by portal role and trial state.
10. Workflow actions update local state and, in live mode, sync to the backend.
11. Reports are derived after FDA disclosure.

## API Client

`src/api/client.ts` centralizes backend communication. It:

- Reads `VITE_API_URI` and `VITE_DEMO_MODE`.
- Tracks an in-memory auth token.
- Sends JSON requests with `Authorization: Bearer <token>` after login.
- Throws immediately when fallback mode is active.
- Marks the API unavailable after failed network requests so the app can continue with seeded data.

### Backend Endpoints Used

| Action | Endpoint |
|---|---|
| Login | `POST /auth/login` |
| Load workflow snapshot | `GET /workflow/snapshot` |
| Create trial | `POST /workflow/trials` |
| Approve trial | `POST /workflow/trials/:trialId/approve` |
| Reject trial | `POST /workflow/trials/:trialId/reject` |
| Enroll patient | `POST /workflow/trials/:trialId/enrollments` |
| Import patients | `POST /workflow/trials/:trialId/import-patients` |
| Log appointment | `POST /workflow/trials/:trialId/appointments` |
| Submit batch | `POST /workflow/trials/:trialId/batch` |
| Save assignments | `POST /workflow/trials/:trialId/assignments` |
| Notify FDA | `POST /workflow/trials/:trialId/notify-fda` |
| Disclose trial | `POST /workflow/trials/:trialId/disclosure` |
| Archive trial | `POST /workflow/trials/:trialId/archive` |
| Delete trial | `DELETE /workflow/trials/:trialId` |

## Snapshot Contract

The dashboard hydrates from a backend snapshot mapped by `src/api/dtoMappers.ts`.

```ts
interface BackendSnapshotDto {
  trials: Trial[];
  patients: Patient[];
  trialPatients: TrialPatientsByTrial;
  assignments: Record<string, TrialAssignmentMap>;
  reports?: Record<string, ReportRow[]>;
}
```

Missing snapshot arrays or maps are normalized to empty values before they reach the stores.

## Seeded Fallback Architecture

Seeded fallback mode is active when:

- `VITE_DEMO_MODE=true`
- `VITE_API_URI` is empty
- a network request fails and the API client marks the backend unavailable
- `hydrateFromApi()` does not receive a snapshot within the dashboard timeout

Fallback data is loaded from:

- `src/data/seedPortals.ts`
- `src/data/seedTrials.ts`
- `src/data/seedPatients.ts`
- `src/data/seedAssignments.ts`
- `src/data/seedIcdCodes.ts`

The stores use `structuredClone()` when initializing seed data so local demo state can mutate without changing the source modules.

## Main Source Areas

| Area | Path | Responsibility |
|---|---|---|
| API | `src/api` | Live backend client and DTO mapping. |
| Views | `src/views` | Login, dashboard, and not-found screens. |
| Router | `src/router` | Route definitions and metadata. |
| Stores | `src/stores` | Auth, UI, patients, trials, assignments, enrollments, hydration state, and audit state. |
| Components | `src/components` | Trial workspace, role tabs, tables, forms, modals, and navigation. |
| Composables | `src/composables` | Domain logic for statuses, eligibility, reports, appointments, assignments, and batches. |
| Data | `src/data` | Seeded fallback portals, trials, patients, ICD codes, and assignments. |
| Types | `src/types` | TypeScript interfaces and enum-like union types. |
| Utilities | `src/utils` | CSV parsing and privacy masking. |

## Store Responsibilities

| Store | Responsibility |
|---|---|
| `auth.store.ts` | Selected portal, login state, backend login, fallback credential validation, current portal. |
| `trials.store.ts` | Trial records, API hydration, fallback state, enrollments, assignment maps, audit events, archive filters, workflow transitions. |
| `patients.store.ts` | Patient records and patient create/update/delete operations. |
| `ui.store.ts` | Active tab, modal state, selected patient, and toasts. |

## Workflow State Architecture

Trial progression is controlled by store methods and status helpers:

- `hydrateFromApi()`
- `createTrial()`
- `approveTrial()`
- `rejectTrial()`
- `enrollPatient()`
- `importPatients()`
- `submitBatch()`
- `saveAssignments()`
- `logAppointment()`
- `notifyFda()`
- `discloseTrial()`
- `toggleArchive()`
- `deleteTrial()`

In live mode, workflow methods optimistically update Pinia state and then sync with the backend. Successful backend responses apply the returned snapshot; failed syncs switch the visible API fallback flag so the UI can continue from local state.

`useTrialStatus.ts` controls status labels, visible tabs, archive permissions, approval availability, and workflow review badges.

## Privacy Architecture

The frontend enforces privacy in display helpers:

- `canShowPatientPii()` allows PII only for Jane Hopkins roles.
- `buildPatientDisplay()` masks patient name and DOB for FDA and Bavaria.
- `buildReportRowDisplay()` uses role-specific patient display rules.
- Treatment assignments remain hidden from Jane Hopkins and Bavaria before FDA disclosure.

Live deployments must also enforce these rules in the backend because frontend masking is not a security boundary.

## Production Notes

The backend is now responsible for durable workflow state in live mode. Production hardening should still include:

- Server-side RBAC on every endpoint.
- Encrypted PII storage.
- Durable append-only audit logs.
- Database-backed trial, patient, appointment, batch, assignment, and report records.
- Soft deletion and retention policies.
- Compliance validation outside the frontend.
