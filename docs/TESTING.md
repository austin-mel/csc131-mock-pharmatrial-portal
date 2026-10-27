# Testing

Complete the [project setup](../README.md#application-setup), then run commands from the repository root.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` runs Vitest first and runs Playwright only if unit tests pass. Both suites use synthetic data and do not require a running backend.

## Commands

| Task                             | Command                                            |
| -------------------------------- | -------------------------------------------------- |
| Unit and component tests         | `pnpm test:unit`                                   |
| Unit watch mode                  | `pnpm exec vitest`                                 |
| Unit coverage report             | `pnpm test:unit --coverage`                        |
| Browser tests                    | `pnpm test:e2e`                                    |
| Desktop browser tests            | `pnpm test:e2e --project=desktop-chromium`         |
| Interactive browser runner       | `pnpm exec playwright test --ui`                   |
| Browser HTML report              | `pnpm exec playwright show-report`                 |
| Build                            | `pnpm build`                                       |
| Type-check app and configuration | `pnpm exec vue-tsc --build`                        |
| Type-check app and tests         | `pnpm exec vue-tsc --noEmit -p tsconfig.test.json` |
| Preview production build         | `pnpm preview`                                     |

The build script runs Vite only. Type-checking is a separate check.

## Vitest

[Configuration](../vitest.config.ts) discovers only `tests/unit/**/*.test.ts`, compiles Vue components with the Vue plugin, and uses jsdom. It does not load the application's local environment file. Each test gets a fresh Pinia instance; mounted components, fake timers, spies, environment overrides and mocked globals are cleaned up between tests. Network access is mocked at the fetch boundary.

Coverage includes application TypeScript and Vue components, including untested files. Type declarations, seed data, barrel exports, assets and the bootstrap entry are excluded. `pnpm test:unit --coverage` writes `coverage/index.html` and enforces minimums of 80% statements, 80% lines, 70% branches and 75% functions.

The suite covers:

- CSV parsing, upload previews, invalid rows, aliases, eligibility and import effects.
- Eligibility rules, cohort selection, dose totals, appointment normalization and dose caps.
- Batch calculations, randomized assignment invariants, reports and patient privacy for all four portals.
- Trial lifecycle permissions, approval order, rejection, archival/deletion, audit events, search and pagination.
- Auth, patient and UI stores; API request serialization, bearer-token handling, HTTP errors, connection fallback, retry and hydration timeouts.
- Vue form controls, pagination, modal dismissal, notifications, workflow forms, patient details, workspace tabs and published reports.

The former standalone `tests/auth/login.test.mjs` regressions now run in `tests/unit/auth-api.test.ts`. Login timing tests use fake timers, including the 60-second timeout and the earlier three-second regression.

## Playwright

[Configuration](../playwright.config.ts) starts Vite at `http://127.0.0.1:4174/pharmatrial-portal/` in `e2e` mode with `VITE_DEMO_MODE=true` and an empty API URI. This skips `environment/.front-end.env`. Keep port 4174 available; strict port binding prevents accidentally testing another server. Tests use the deployed base path and hash routes.

| Profile            | Viewport                  |
| ------------------ | ------------------------- |
| `desktop-chromium` | 1440 × 900                |
| `tablet-chromium`  | 768 × 1024, touch enabled |
| `mobile-chromium`  | Pixel 5 emulation         |

Every scenario runs in each profile. Tests use fresh browser contexts; the lifecycle scenario changes roles through logout and sign-in within one page so its in-memory trial persists. Tests fail on unexpected backend requests.

Coverage includes all portal logins, incorrect credentials, protected routes, unknown routes, session reset, responsive navigation, CSV download/import/validation, patient search/detail/edit/delete, follow-up appointments, adverse events, role-specific patient privacy and final reports. A complete UI lifecycle creates a trial, obtains FDA and JH approvals, enrolls a patient, ships a batch, locks randomized assignments, records dosing, transmits results, publishes the report and archives the trial. A separate rejection flow verifies deletion cancellation and confirmation.

Playwright retains screenshots, video and traces for failures in `test-results/`, with an HTML report in `playwright-report/`. CI forbids focused tests and retries failures twice. These directories and `coverage/` are ignored by Git.

If using an installed Chrome or Edge instead of bundled Chromium, set `PLAYWRIGHT_BROWSER_CHANNEL=chrome` or `msedge` (PowerShell: `$env:PLAYWRIGHT_BROWSER_CHANNEL = "msedge"`). On Linux CI, install browser OS dependencies with `pnpm exec playwright install --with-deps chromium`.

The browser tests exercise the frontend's demo workflow. API unit tests mock transport responses; neither suite verifies a deployed backend, database persistence, or cross-browser Firefox/WebKit compatibility.
