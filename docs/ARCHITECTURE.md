# Architecture

Pharmatrial uses Vue 3 for presentation, Pinia for state, Vue Router for navigation, and Tailwind CSS for styling. The frontend supports a compatible workflow API and an in-memory demo.

## Configuration and runtime modes

[Vite configuration](../vite.config.ts) loads variables from `environment/`, then applies `environment/.front-end.env`. Process environment values override both API settings. The `e2e` mode skips the custom file.

| Variable         | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `VITE_API_URI`   | API base URL, such as `http://localhost:3000/api`. |
| `VITE_DEMO_MODE` | Set `true` to use demo data even with an API URL.  |

The [API client](../src/api/client.ts) trims a trailing slash from the URL and selects demo mode when the URL is empty or `VITE_DEMO_MODE=true`. Otherwise, it attempts live requests.

| Event                                    | Behavior                                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Demo mode                                | Stores use seed data and auth validates demo credentials.                                                       |
| Successful API login                     | The client holds the bearer token in memory and sends it with subsequent requests.                              |
| Successful snapshot load                 | Stores replace local workflow data with the snapshot.                                                           |
| Network failure                          | The client disables further API requests for the page session; stores retain current local data.                |
| Snapshot failure or three-second timeout | The dashboard retains local data and shows fallback state. A timeout alone does not disable later API requests. |
| Workflow sync failure                    | The store retains the local update and marks fallback state. HTTP errors alone do not disable the API client.   |

HTTP login errors fail authentication; they do not trigger demo login. Refreshing the page clears local state and the token. In demo mode, stores reload seeds.

## Application flow

1. The user selects a portal at `/`. The auth store validates credentials through the API or demo data.
2. Route guards send authenticated users to `/dashboard` and redirect unauthenticated dashboard requests to login.
3. The dashboard loads `GET /workflow/snapshot` in live mode.
4. Role and trial-state helpers select visible trials, tabs, and actions.
5. Workflow actions update Pinia immediately. Supported live actions call the API and apply successful snapshot responses.

The [status helpers](../src/composables/trials/useTrialStatus.ts) define action availability and lifecycle labels. Follow the [demo walkthrough](../README.md#demo-walkthrough) for the required action order.

## API routes

The client sends JSON requests and adds `Authorization: Bearer <token>` after login. Paths below are relative to `VITE_API_URI`.

| Action           | Endpoint                                         |
| ---------------- | ------------------------------------------------ |
| Login            | `POST /auth/login`                               |
| Load snapshot    | `GET /workflow/snapshot`                         |
| Create trial     | `POST /workflow/trials`                          |
| Approve trial    | `POST /workflow/trials/:trialId/approve`         |
| Reject trial     | `POST /workflow/trials/:trialId/reject`          |
| Enroll patient   | `POST /workflow/trials/:trialId/enrollments`     |
| Import patients  | `POST /workflow/trials/:trialId/import-patients` |
| Log appointment  | `POST /workflow/trials/:trialId/appointments`    |
| Submit batch     | `POST /workflow/trials/:trialId/batch`           |
| Save assignments | `POST /workflow/trials/:trialId/assignments`     |
| Notify FDA       | `POST /workflow/trials/:trialId/notify-fda`      |
| Disclose trial   | `POST /workflow/trials/:trialId/disclosure`      |
| Archive trial    | `POST /workflow/trials/:trialId/archive`         |
| Delete trial     | `DELETE /workflow/trials/:trialId`               |

## Snapshot contract

The [DTO mapper](../src/api/dtoMappers.ts) normalizes missing arrays and maps to empty values.

| Field           | Type                                   |
| --------------- | -------------------------------------- |
| `trials`        | `Trial[]`                              |
| `patients`      | `Patient[]`                            |
| `trialPatients` | `TrialPatientsByTrial`                 |
| `assignments`   | `Record<string, TrialAssignmentMap>`   |
| `reports`       | Optional `Record<string, ReportRow[]>` |

See the [data dictionary](DATA_DICTIONARY.md) for field definitions. The current UI derives reports from local trial data; the trial store does not apply the optional snapshot reports.

## Source map

| Path                                      | Responsibility                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| [`src/api/`](../src/api/)                 | Send requests and map DTOs.                                             |
| [`src/views/`](../src/views/)             | Render login, dashboard, and not found screens.                         |
| [`src/router/`](../src/router/)           | Define routes and access guards.                                        |
| [`src/components/`](../src/components/)   | Render trial tabs, tables, forms, and modals.                           |
| [`src/composables/`](../src/composables/) | Compute eligibility, status, assignments, doses, and reports.           |
| [`src/data/`](../src/data/)               | Supply synthetic portals, trials, patients, ICD codes, and assignments. |
| [`src/types/`](../src/types/)             | Define domain types.                                                    |
| [`src/utils/`](../src/utils/)             | Parse CSV files and format privacy-aware displays.                      |

| Store                                                  | Responsibility                                                                         |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [`auth.store.ts`](../src/stores/auth.store.ts)         | Select portals, authenticate users, and log out.                                       |
| [`trials.store.ts`](../src/stores/trials.store.ts)     | Manage trials, enrollments, assignments, hydration, audit events, and archive filters. |
| [`patients.store.ts`](../src/stores/patients.store.ts) | Create, update, find, and delete patient records.                                      |
| [`ui.store.ts`](../src/stores/ui.store.ts)             | Track tabs, modals, selected patients, and toasts.                                     |

## Privacy and persistence

[Privacy helpers](../src/utils/privacy.ts) show PII to Jane Hopkins roles and mask patient names and dates of birth for FDA and Bavaria. The interface hides treatment assignments from Jane Hopkins and Bavaria until disclosure.

Pinia holds demo data and audit events in memory. A production backend must enforce role-based access, protect PII, persist workflow and audit records, and implement retention and deletion rules. Frontend display rules do not establish a security boundary.
