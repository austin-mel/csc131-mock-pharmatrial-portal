# Pharmatrial

Pharmatrial is a privacy-aware, role-based clinical trial portal built with Vue 3 and TypeScript. It models blinded collaboration between Jane Hopkins Hospital, Bavaria Pharma, and FDA Administration.

The current application is wired to a live backend by default when `VITE_API_URI` is configured. On login, the frontend authenticates against the backend, hydrates workflow state from the live server, and sends trial, patient, appointment, batch, assignment, disclosure, archive, and delete actions back through the API. If no backend URL is configured, `VITE_DEMO_MODE=true` is set, or the live API becomes unavailable, the app falls back to seeded local data so the full workflow can still be demonstrated.

## Key Features

- Role-selected portals for Jane Hopkins Doctor, Jane Hopkins Admin, FDA Administrator, and Bavaria Admin.
- Live backend data hydration through `/workflow/snapshot`.
- API-backed workflow actions for approvals, enrollment, CSV import, appointments, batch submission, FDA assignments, notification, disclosure, archive, and deletion.
- Seeded-data fallback for local demos, offline review, and backend downtime.
- Patient PII masking for FDA and Bavaria views.
- CSV patient import with row validation and eligibility checks.
- Appointment logging and dose tracking for eligible patients.
- Bavaria batch submission after required approvals.
- FDA Administrator treatment/placebo assignment and final disclosure.
- Post-disclosure reporting for treatment outcomes and adverse events.

## Documentation Map

| Read This | When You Need |
|---|---|
| [Jane Hopkins Doctor Guide](docs/JHDOCTOR.md) | Patient management, CSV import, appointments, and dose tracking. |
| [Jane Hopkins Admin Guide](docs/JHADMIN.md) | JH approval, enrollment review, completion tracking, and FDA notification. |
| [FDA Administrator Guide](docs/FDA.md) | Trial approval, eligibility rules, assignments, disclosure, and regulatory review. |
| [Bavaria Guide](docs/BAVARIA.md) | Trial creation, batch submission, non-PII monitoring, reports, and archive actions. |
| [Architecture Reference](docs/ARCHITECTURE.md) | Frontend architecture, backend API integration, and fallback behavior. |
| [Backend Architecture Reference](../csc131.mock.back-end/docs/ARCHITECTURE.md) | Server setup, runtime configuration, and endpoint behavior. |
| [Data Dictionary](docs/DATA_DICTIONARY.md) | Patient, trial, appointment, state, audit, and lifecycle data definitions. |

## System Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | `^20.19.0` or `>=22.12.0` |
| Package manager | `pnpm` recommended because the repo includes `pnpm-lock.yaml` |
| Backend API | A running Pharmatrial backend for live data mode |
| Browser | Current Chrome, Edge, Firefox, or Safari |
| Editor | VS Code with Volar recommended for Vue SFC support |

## Application Setup

Install dependencies:

```sh
pnpm install
```

Create the frontend environment file from the example:

```sh
Copy-Item environment\.example.front-end.env environment\.front-end.env
```

Configure `environment/.front-end.env`:

```env
VITE_API_URI=http://localhost:3000/api
VITE_DEMO_MODE=false
```

Use the backend API base URL, including `/api` and without a trailing slash. The frontend trims a trailing slash if one is provided.

Start the local development server:

```sh
pnpm dev
```

Build and type-check:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```

## Live Backend Mode

Live mode is active when `VITE_API_URI` is set and `VITE_DEMO_MODE` is not `true`.

At runtime:

1. Login calls `POST /auth/login` with the selected portal ID, email, and password.
2. Successful login stores the returned bearer token in memory.
3. The dashboard loads `GET /workflow/snapshot`.
4. Workflow actions update local UI state immediately, then call the matching backend endpoint.
5. Successful backend mutations return or trigger a refreshed workflow snapshot.

The frontend expects the backend snapshot shape to include:

```ts
{
  trials: Trial[];
  patients: Patient[];
  trialPatients: TrialPatientsByTrial;
  assignments: Record<string, TrialAssignmentMap>;
  reports?: Record<string, ReportRow[]>;
}
```

## Seeded-Data Fallback

The app automatically uses seeded local data when any of these are true:

- `VITE_DEMO_MODE=true`
- `VITE_API_URI` is empty
- the API request layer marks the backend unavailable
- the initial dashboard snapshot does not return before the hydration timeout

Fallback data comes from `src/data` and is loaded into Pinia stores. This mode keeps the demo usable without a server, but changes are browser-local and are not persisted to the backend.

## Demo Portals

| Portal | Demo User | Main Purpose |
|---|---|---|
| Jane Hopkins Doctor | Dr. Sarah Chen | Manage patients, appointments, and doses. |
| Jane Hopkins Admin | Emily Rodriguez | Approve JH review and notify FDA after dosing completion. |
| FDA Administrator | Michael Torres | Approve trials, assign treatment groups, and disclose results. |
| Bavaria Admin | Anna Keller | Create trials, submit batches, monitor status, and archive closed trials. |

## Demo Login Credentials

These credentials are also used by seeded fallback mode.

| Portal | Email | Password |
|---|---|---|
| Jane Hopkins Doctor | `doctor@jh.example` | `jh-doctor-demo` |
| Jane Hopkins Admin | `admin@jh.example` | `jh-admin-demo` |
| FDA Administrator | `admin@fda.example` | `fda-demo` |
| Bavaria Admin | `admin@bavaria.example` | `bavaria-demo` |

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Portal selection and login. |
| `/dashboard` | Authenticated Users | Main trial workspace for the selected role. |
| `/:pathMatch(.*)*` | Public | Not found page. |

Authenticated routes are protected against direct URL access, and cross-persona access is constrained by the selected portal state, role-scoped tabs, and privacy-aware display rules.

## Privacy Rules

- Jane Hopkins roles can see patient PII for clinical workflows.
- FDA and Bavaria views mask patient names and DOB values before disclosure.
- Jane Hopkins and Bavaria cannot see Bavaria/placebo assignments before FDA disclosure.
- Reports become visible only after FDA publishes final disclosure.
- The frontend still applies privacy display rules, but live deployments should also enforce authorization and PII restrictions on the backend.

## Project Structure

```text
environment/   Frontend environment example and local env file location
src/
  api/          Backend API client and DTO mapping helpers
  assets/       Logos, SVG assets, and global Tailwind styles
  components/   Reusable UI, trial tabs, modals, tables, and navigation
  composables/  Domain logic for trials, patients, batches, appointments, and reports
  data/         Seeded fallback portals, trials, patients, ICD codes, and assignments
  router/       Vue Router routes and route metadata
  stores/       Pinia stores for auth, UI, trials, and patients
  types/        TypeScript domain models
  utils/        CSV parsing and privacy display helpers
```

## Source References

- Requirements: [docs/REQUIREMENTS.html](docs/REQUIREMENTS.html)
- API client: `src/api/client.ts`
- Snapshot DTO mapping: `src/api/dtoMappers.ts`
- Trial workflow state: `src/stores/trials.store.ts`
- Auth and portal login: `src/stores/auth.store.ts`, `src/data/seedPortals.ts`
- Patient workflow: `src/stores/patients.store.ts`, `src/composables/patients`
- Seeded fallback data: `src/data`
- Privacy helpers: `src/utils/privacy.ts`
