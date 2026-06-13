# Pharmatrial

Pharmatrial is a privacy-aware, role-based clinical trial portal built with Vue 3 and TypeScript. It models blinded collaboration between Jane Hopkins Hospital, Bavaria Pharma, and FDA Administration.

The app uses role-selected demo portals and seeded browser-side clinical trial data to demonstrate trial approvals, patient enrollment, eligibility checks, appointments, dose tracking, Bavaria batch submission, FDA Administrator treatment assignment, final disclosure, and reporting. It is designed as a complete front-end proof of concept with role-scoped access, patient privacy rules, and a state-driven trial lifecycle. 

## Key Features

- Role-selected demo portals for Jane Hopkins Doctor, Jane Hopkins Admin, FDA Administrator, and Bavaria Admin.
- Multi-step trial approval workflow across FDA Administration and Jane Hopkins Hospital.
- Patient PII masking for FDA and Bavaria views.
- CSV patient import with row validation and eligibility checks.
- Appointment logging and dose tracking for eligible patients.
- Bavaria batch submission after required approvals.
- FDA Administrator treatment/placebo assignment and final disclosure.
- Post-disclosure reporting for treatment outcomes and adverse events.

## Portfolio Highlights

- Vue 3 and TypeScript single-page application built with Vite.
- Pinia-powered workflow state model for trials, patients, assignments, and audit events.
- Role-scoped UI behavior that changes tabs, actions, and patient visibility by portal.
- Clinical trial lifecycle modeling from draft creation through final disclosure.
- Privacy and blinded-assignment rules for patient PII and treatment groups.
- Comprehensive role guides, architecture notes, and data dictionary documentation.

## Documentation Map

| Read This | When You Need |
|---|---|
| [Jane Hopkins Doctor Guide](docs/JHDOCTOR.md) | Patient management, CSV import, appointments, and dose tracking. |
| [Jane Hopkins Admin Guide](docs/JHADMIN.md) | JH approval, enrollment review, completion tracking, and FDA notification. |
| [FDA Administrator Guide](docs/FDA.md) | Trial approval, eligibility rules, assignments, disclosure, and regulatory review. |
| [Bavaria Guide](docs/BAVARIA.md) | Trial creation, batch submission, non-PII monitoring, reports, and archive actions. |
| [Architecture Reference](docs/ARCHITECTURE.md) | How the Vue app is organized. |
| [Data Dictionary](docs/DATA_DICTIONARY.md) | Patient, trial, appointment, state, audit, and lifecycle data definitions. |

## System Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | `^20.19.0` or `>=22.12.0` |
| Package manager | `pnpm` recommended because the repo includes `pnpm-lock.yaml` |
| Browser | Current Chrome, Edge, Firefox, or Safari |
| Editor | VS Code with Volar recommended for Vue SFC support |

## Setup

Install dependencies:

```sh
pnpm install
```

Run the local development server:

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

## Demo Portals

| Portal | Demo User | Main Purpose |
|---|---|---|
| Jane Hopkins Doctor | Dr. Sarah Chen | Manage patients, appointments, and doses. |
| Jane Hopkins Admin | Emily Rodriguez | Approve JH review and notify FDA after dosing completion. |
| FDA Administrator | Michael Torres | Approve trials, assign treatment groups, and disclose results. |
| Bavaria Admin | Anna Keller | Create trials, submit batches, monitor status, and archive closed trials. |

## Demo Login Credentials

| Portal | Email | Password |
|---|---|---|
| Jane Hopkins Doctor | `doctor@jh.example` | `jh-doctor-demo` |
| Jane Hopkins Admin | `admin@jh.example` | `jh-admin-demo` |
| FDA Administrator | `admin@fda.example` | `fda-demo` |
| Bavaria Admin | `admin@bavaria.example` | `bavaria-demo` |

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Portal selection and demo login. |
| `/dashboard` | Authenticated Users | Main trial workspace for the selected role. |
| `/:pathMatch(.*)*` | Public | Not found page. |

Authenticated routes are protected against direct URL access, and cross-persona access is constrained by the selected portal state, role-scoped tabs, and privacy-aware display rules.

## Privacy Rules

- Jane Hopkins roles can see patient PII for clinical workflows.
- FDA and Bavaria views mask patient names and DOB values before disclosure.
- Jane Hopkins and Bavaria cannot see Bavaria/placebo assignments before FDA disclosure.
- Reports become visible only after FDA publishes final disclosure.
- This is a front-end demo with seeded in-memory data, not a production-compliant clinical system.

## Project Structure

```text
src/
  assets/       Logos, SVG assets, and global Tailwind styles
  components/   Reusable UI, trial tabs, modals, tables, and navigation
  composables/  Domain logic for trials, patients, batches, appointments, and reports
  data/         Seeded portals, trials, patients, ICD codes, and assignments
  router/       Vue Router routes and route metadata
  stores/       Pinia stores for auth, UI, trials, and patients
  types/        TypeScript domain models
  utils/        CSV parsing and privacy display helpers
```

## Source References

- Requirements: [REQUIREMENTS.html](REQUIREMENTS.html)
- Trial workspace components: `src/components/Trials`
- Trial workflow state: `src/stores/trials.store.ts`
- Auth and demo portals: `src/stores/auth.store.ts`, `src/data/seedPortals.ts`
- Patient workflow: `src/stores/patients.store.ts`, `src/composables/patients`
- Privacy helpers: `src/utils/privacy.ts`
