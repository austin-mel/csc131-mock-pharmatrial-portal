# Backend Architecture Reference

## Summary

The Pharmatrial backend is an Express API that persists live clinical trial workflow state in PostgreSQL through Prisma. It is the source of truth for live frontend mode: the Vue app authenticates against `/api/auth/login`, hydrates from `/api/workflow/snapshot`, and sends workflow actions back through role-gated `/api/workflow` endpoints.

The backend has built-in demo login identities, but it does not provide seeded workflow fallback data. Seeded fallback lives in the frontend and is used only when the frontend is explicitly in demo mode or cannot use the live API.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server | Express 5 |
| Language | TypeScript |
| Persistence | Prisma Client |
| Database | PostgreSQL-compatible database; Neon supported |
| Auth | HMAC-signed bearer token helper in `src/auth/token.ts` |
| Validation | Zod validators exist for legacy routes; workflow routes currently validate in service logic |
| Environment | `dotenv` loading from `environment/.back-end.env` |

## Runtime Configuration

The server loads `environment/.back-end.env` in both `src/server.ts` and `src/app.ts`. Prisma reads the database URL from `BACK_END_HOST` through `prisma/schema.prisma`.

| Variable | Required | Default | Used By | Description |
|---|---:|---|---|---|
| `PORT` | No | `3000` | `src/server.ts` | HTTP listen port. |
| `CORS_ORIGIN` | No | Allow all origins | `src/app.ts` | Comma-separated allowlist for browser clients, such as `http://localhost:5173`. |
| `BACK_END_HOST` | Yes | None | Prisma, Neon helper | PostgreSQL connection string. The name is retained for current Prisma configuration. |
| `AUTH_TOKEN_SECRET` | Recommended | `pharmatrial-local-dev-secret` | `src/auth/token.ts` | HMAC secret used to sign and verify API bearer tokens. Shared or deployed environments should always set this. |
| `AUTH_TOKEN_ISSUER` | No | `pharmatrial-backend` | `src/auth/token.ts` | Expected token issuer. |
| `AUTH_TOKEN_AUDIENCE` | No | `pharmatrial-frontend` | `src/auth/token.ts` | Expected token audience. |
| `AUTH_TOKEN_TTL_SECONDS` | No | `28800` | `src/auth/token.ts` | Token lifetime in seconds. |

Recommended local pairing with the frontend:

```env
# backend: environment/.back-end.env
PORT=3000
CORS_ORIGIN=http://localhost:5173
BACK_END_HOST=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
AUTH_TOKEN_SECRET=replace-with-a-long-random-secret
AUTH_TOKEN_ISSUER=pharmatrial-backend
AUTH_TOKEN_AUDIENCE=pharmatrial-frontend
AUTH_TOKEN_TTL_SECONDS=28800
```

```env
# frontend: environment/.front-end.env
VITE_API_URI=http://localhost:3000/api
VITE_DEMO_MODE=false
```

## Request Flow

1. `src/server.ts` loads environment variables and starts the Express app.
2. `src/app.ts` configures CORS, JSON parsing, and mounts `src/routes/index.ts` at `/api`.
3. `POST /api/auth/login` authenticates either a persisted `PortalUser` or a built-in demo identity.
4. Login returns a signed bearer token with `sub`, `portalId`, `role`, `email`, issuer, audience, issued-at, and expiration claims.
5. Workflow routes require `Authorization: Bearer <token>`.
6. `requireAuth` verifies signature, issuer, audience, and expiration before attaching `req.user`.
7. Workflow controllers pass the authenticated actor and request body to `pharmatrial.service.ts`.
8. The service enforces role gates, mutates Prisma records, writes audit events, and returns a fresh role-filtered snapshot.

## Route Mounting

`src/routes/index.ts` exposes:

| Mount | Router | Notes |
|---|---|---|
| `/api/auth` | `auth.routes.ts` | Public login endpoint. |
| `/api/workflow` | `workflow.routes.ts` | Authenticated snapshot and workflow mutations. |
| `/api/trials` | `workflow.routes.ts` | Compatibility alias for the workflow router. |

`patient.routes.ts` and `trial.routes.ts` are present but not mounted by the current root router. They should be treated as legacy code unless explicitly wired into `src/routes/index.ts`.

## Endpoint Map

All workflow endpoints require a bearer token.

| Method | Path | Service Function | Role Gate |
|---|---|---|---|
| `POST` | `/api/auth/login` | `login` | Public |
| `GET` | `/api/workflow` | `snapshot` | Any authenticated role |
| `GET` | `/api/workflow/snapshot` | `snapshot` | Any authenticated role |
| `POST` | `/api/workflow/trials` | `createTrial` | Bavaria |
| `POST` | `/api/workflow/trials/:id/approve` | `approveTrial` | FDA or JH Admin at the correct approval gate |
| `POST` | `/api/workflow/trials/:id/reject` | `rejectTrial` | FDA or JH Admin at the correct rejection gate |
| `POST` | `/api/workflow/trials/:id/enrollments` | `upsertEnrollment` | JH Doctor or JH Admin |
| `POST` | `/api/workflow/trials/:id/import-patients` | `upsertEnrollment` per row | JH Doctor or JH Admin |
| `POST` | `/api/workflow/trials/:id/appointments` | `logAppointment` | JH Doctor |
| `POST` | `/api/workflow/trials/:id/doses` | `logAppointment` | JH Doctor; compatibility alias |
| `POST` | `/api/workflow/trials/:id/batch` | `submitBatch` | Bavaria |
| `POST` | `/api/workflow/trials/:id/assignments` | `saveAssignments` | FDA |
| `POST` | `/api/workflow/trials/:id/notify-fda` | `notifyFda` | JH Admin |
| `POST` | `/api/workflow/trials/:id/disclosure` | `discloseTrial` | FDA |
| `POST` | `/api/workflow/trials/:id/reports` | `discloseTrial` | FDA; compatibility alias |
| `POST` | `/api/workflow/trials/:id/archive` | `archiveTrial` | Bavaria |
| `DELETE` | `/api/workflow/trials/:id` | `deleteTrial` | Bavaria, archived rejected trials only |

## Snapshot Contract

The snapshot endpoint returns data shaped for the frontend stores:

```ts
{
  trials: Trial[];
  patients: Patient[];
  trialPatients: TrialPatientsByTrial;
  assignments: Record<string, TrialAssignmentMap>;
  reports: Record<string, ReportRow[]>;
}
```

Snapshot data is role-filtered:

- JH Doctor sees only active trials and completed disclosed trials.
- Jane Hopkins roles receive patient PII.
- FDA and Bavaria receive masked patient names and blank DOB values.
- FDA can see assignments before disclosure.
- Non-FDA roles see assignments only after disclosure.

## Data Model

Prisma models live in `prisma/schema.prisma`.

| Model | Purpose |
|---|---|
| `PortalUser` | Persisted login users and role identity metadata. |
| `Trial` | Core trial lifecycle, approval state, disclosure flags, dose target, and eligibility criteria. |
| `Patient` | Patient clinical data and PII. |
| `Enrollment` | Trial-patient join with eligibility, dose count, appointments, and assignment relation. |
| `Appointment` | Appointment and dose administration events. |
| `Batch` | Bavaria batch metadata and treatment percentage. |
| `Assignment` | FDA treatment/placebo assignment and tracking ID. |
| `TrialReport` | Disclosure report rows stored as JSON. |
| `AuditEvent` | Workflow audit trail with actor role and entity metadata. |

## Workflow Gates

`src/services/pharmatrial.service.ts` enforces workflow rules before writing data:

- Bavaria creates trials, submits batches, archives closed trials, and deletes archived rejected trials.
- FDA performs the first approval or rejection, locks assignments, and publishes disclosure.
- Jane Hopkins Admin approves after patients are enrolled and notifies FDA after all eligible patients are dosed.
- Jane Hopkins Doctor logs appointments and dose administrations for eligible patients.
- Enrollment closes after FDA notification.
- Disclosure requires FDA notification, locked assignments, and all eligible patients dosed.

Most successful workflow mutations return `snapshot(actor.portalId)` so the frontend can refresh from the role-filtered server state.

## Authentication Notes

`src/auth/token.ts` signs simple HS256-style bearer tokens using Node `crypto`. The token helper verifies signature, issuer, audience, and expiration.

Login first checks `PortalUser` records by email. If no persisted user exists, it checks the built-in demo identities from `auth.controller.ts`. Demo users are useful for local review, but their actor IDs are not persisted as `PortalUser` rows; audit events from demo users store `actorId` as `null` and keep the actor role.

## Error Handling

Workflow controllers catch service errors and return JSON:

```json
{ "message": "Workflow error message" }
```

Service functions attach HTTP status codes for expected gate failures:

- `400` for invalid request values.
- `401` for missing or invalid authentication.
- `403` for role-gate failures.
- `404` for unavailable trials.
- `409` for workflow-state conflicts.
- `500` for unexpected errors.

## Frontend Fallback Relationship

The frontend falls back to seeded data when `VITE_DEMO_MODE=true`, `VITE_API_URI` is empty, the API is unavailable, or snapshot hydration times out. That fallback is not served by this backend.

For live integration, keep these aligned:

- Backend `PORT` and frontend `VITE_API_URI`.
- Backend `CORS_ORIGIN` and frontend dev/preview origin.
- Backend token issuer/audience and token verification defaults.
- Snapshot shape expected by `src/api/dtoMappers.ts` in the frontend.

## Production Hardening Notes

- Set a strong `AUTH_TOKEN_SECRET` outside source control.
- Restrict `CORS_ORIGIN` to known frontend origins.
- Use database migrations rather than ad hoc schema pushes for shared environments.
- Keep PII restrictions enforced in service queries and response DTOs.
- Preserve durable `AuditEvent` rows for regulated workflow actions.
- Replace demo identity fallback if production authentication is introduced.
