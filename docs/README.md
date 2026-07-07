# Pharmatrial Documentation

A documentation hub for a Vue 3 and TypeScript clinical-trial workflow demo with role-specific portals, seeded fallback data, and live API integration through the companion backend on the `apps.back-end` branch.

## What this project does

Pharmatrial is a frontend application for a fictional trial workflow. The local files document portal-based login, role-specific dashboards, patient and trial workflow actions, privacy-aware display rules, seeded fallback data, and live backend communication through API endpoints. The companion backend project is available locally at `C:\Users\Austin\Desktop\Everything\Coding\csc131.mock.back-end` and in the repository branch [`apps.back-end`](https://github.com/austin-mel/csc131-mock-pharmatrial-portal/tree/apps.back-end).

The app uses Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS, Flowbite, and Flowbite Vue, as listed in the project files.

## Why it matters

The project demonstrates how workflow state, user role, privacy display, API hydration, and fallback data interact in a browser application. The documentation is organized so reviewers can inspect the demo workflow, understand the role guides, and locate the frontend files that implement each area.

## Project contents

| Area | Files | What to read first |
|---|---|---|
| Application overview | [`../README.md`](../README.md) | Start here for features, setup, demo credentials, routes, and project structure. |
| Requirements | [`./REQUIREMENTS.html`](./REQUIREMENTS.html) | Original requirements artifact included with the project. |
| Architecture | [`./ARCHITECTURE.md`](./ARCHITECTURE.md) | Frontend architecture, API client behavior, fallback mode, stores, privacy helpers, and workflow methods. |
| Data dictionary | [`./DATA_DICTIONARY.md`](./DATA_DICTIONARY.md) | Patient, trial, appointment, state, audit, and lifecycle data definitions. |
| Role guides | [`./JHDOCTOR.md`](./JHDOCTOR.md), [`./JHADMIN.md`](./JHADMIN.md), [`./FDA.md`](./FDA.md), [`./BAVARIA.md`](./BAVARIA.md) | Workflow instructions for each demo portal. |
| Runtime config | [`../environment/.example.front-end.env`](../environment/.example.front-end.env), [`../vite.config.ts`](../vite.config.ts) | Environment file location and Vite configuration. |
| Backend reference | [`apps.back-end`](https://github.com/austin-mel/csc131-mock-pharmatrial-portal/tree/apps.back-end), local backend path: `C:\Users\Austin\Desktop\Everything\Coding\csc131.mock.back-end` | Express/TypeScript API, Prisma/PostgreSQL persistence, authentication, role-gated workflow endpoints, audit logging, and privacy-aware responses. |
| Source areas | [`../src/api`](../src/api), [`../src/stores`](../src/stores), [`../src/data`](../src/data), [`../src/components`](../src/components) | API integration, state management, seeded data, and reusable UI. |

## How to read this documentation

1. Read the project-level `README.md` for the general setup and demo flow.
2. Read `ARCHITECTURE.md` to understand live backend mode, seeded fallback mode, and state flow.
3. Review the companion backend README on the `apps.back-end` branch when you need the Express API, Prisma schema, environment variables, and `/api` workflow endpoints.
4. Read the role guide that matches the portal you want to review.
5. Use `DATA_DICTIONARY.md` when reviewing trial, patient, assignment, report, and audit fields.
6. Use the source-area links when you want to connect documentation to implementation files.

## Main source files used

<details>
<summary>Source files used to prepare this README</summary>

- `README.md`
- `package.json`
- `vite.config.ts`
- `environment/.example.front-end.env`
- `docs/ARCHITECTURE.md`
- `docs/BAVARIA.md`
- `docs/DATA_DICTIONARY.md`
- `docs/FDA.md`
- `docs/JHADMIN.md`
- `docs/JHDOCTOR.md`
- `docs/REQUIREMENTS.html`
- `src/api/client.ts`
- `src/api/dtoMappers.ts`
- `src/router`
- `src/stores`
- `src/data`
- `src/types`
- `src/utils`
- `src/components`
- `src/views`
- `C:\Users\Austin\Desktop\Everything\Coding\csc131.mock.back-end\README.md`

</details>

## Known limits

- The README identifies this as a fictional workflow demo, not a fully deployed clinical-trial system.
- Seeded fallback mode keeps the demo usable without a server, but local fallback changes are browser-local.
- The frontend applies privacy display rules, while the project README notes that live deployments should also enforce authorization and PII restrictions on the backend.
- The live backend is maintained separately on the `apps.back-end` branch and in the local backend folder; this frontend docs page links to that branch instead of duplicating the backend setup guide.

---

<p align="center">
  <img src="./assets/signature.svg" alt="Austin Melendez signature" width="180" />
</p>

<p align="center">
  <strong>Austin Melendez</strong><br />
  <a href="https://austinmelendez.com">Portfolio</a> | <a href="https://github.com/austin-mel">GitHub</a> | <a href="https://github.com/austin-mel/csc131-mock-pharmatrial-portal">Project repository</a>
</p>

