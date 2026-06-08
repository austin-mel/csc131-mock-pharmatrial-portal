# Architecture Reference

## Summary

Pharmatrial is a Vue 3 single-page application that simulates a blinded clinical trial portal. It uses Pinia stores and seeded TypeScript data to model the workflow in the browser.

The app does not currently use a backend API or production database. It is a front-end proof of concept for role-scoped trial workflows.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript |
| Build tool | Vite |
| State management | Pinia |
| Routing | Vue Router |
| Styling | Tailwind CSS, Flowbite, Flowbite Vue |
| Seed data | TypeScript modules in `src/data` |

## Application Flow

1. User opens `/`.
2. `LoginView` lets the user select a demo portal.
3. `auth.store.ts` validates portal-specific demo credentials.
4. Authenticated users enter `/dashboard`.
5. `DashboardView` renders the trial workspace for the selected portal.
6. Trial tabs and actions are filtered by portal role and trial state.
7. Workflow actions update Pinia state.
8. Reports are derived after FDA disclosure.

## Main Source Areas

| Area | Path | Responsibility |
|---|---|---|
| Views | `src/views` | Login, dashboard, and not-found screens. |
| Router | `src/router` | Route definitions and metadata. |
| Stores | `src/stores` | Auth, UI, patients, trials, assignments, enrollments, and audit state. |
| Components | `src/components` | Trial workspace, role tabs, tables, forms, modals, and navigation. |
| Composables | `src/composables` | Domain logic for statuses, eligibility, reports, appointments, assignments, and batches. |
| Data | `src/data` | Seeded portals, trials, patients, ICD codes, and assignments. |
| Types | `src/types` | TypeScript interfaces and enum-like union types. |
| Utilities | `src/utils` | CSV parsing and privacy masking. |

## Store Responsibilities

| Store | Responsibility |
|---|---|
| `auth.store.ts` | Selected portal, login state, demo credentials, current portal. |
| `trials.store.ts` | Trial records, enrollments, assignment maps, audit events, archive filters, workflow transitions. |
| `patients.store.ts` | Patient records and patient create/update/delete operations. |
| `ui.store.ts` | Active tab, modal state, selected patient, and toasts. |

## Privacy Architecture

The current demo enforces privacy in front-end display helpers:

- `canShowPatientPii()` allows PII only for Jane Hopkins roles.
- `buildPatientDisplay()` masks patient name and DOB for FDA and Bavaria.
- `buildReportRowDisplay()` uses role-specific patient display rules.
- Treatment assignments remain hidden from Jane Hopkins and Bavaria before FDA disclosure.

Production systems must enforce these rules server-side.

## Workflow State Architecture

Trial progression is controlled by store methods and status helpers:

- `approveTrial()`
- `rejectTrial()`
- `submitBatch()`
- `saveAssignments()`
- `logAppointment()`
- `notifyFda()`
- `discloseTrial()`
- `toggleArchive()`
- `deleteTrial()`

`useTrialStatus.ts` controls status labels, visible tabs, archive permissions, approval availability, and workflow review badges.

## Production Notes

For production, the current architecture would need:

- Backend APIs for all workflow actions.
- Server-side RBAC.
- Encrypted PII storage.
- Durable audit logs.
- Database-backed trial, patient, appointment, batch, assignment, and report records.
- Soft deletion and retention policies.
- Compliance validation outside the front-end demo.
