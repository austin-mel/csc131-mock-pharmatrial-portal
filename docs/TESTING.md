# Testing

Complete the [project setup](../README.md#application-setup), then run checks from the repository root.

## Build checks

| Task                 | Command               |
| -------------------- | --------------------- |
| Build and type-check | `pnpm build`          |
| Type-check only      | `pnpm run type-check` |
| Build only           | `pnpm run build-only` |
| Preview the build    | `pnpm preview`        |

## Browser tests

Install Chromium once, then run the suite:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

Use `pnpm test:e2e:ui` to open the test runner or `pnpm exec playwright show-report` to inspect the HTML report.

[Playwright configuration](../playwright.config.ts) starts Vite at `http://127.0.0.1:4174` in `e2e` mode with `VITE_DEMO_MODE=true` and an empty `VITE_API_URI`. This mode skips `environment/.front-end.env`. Keep port 4174 available; Playwright starts its own server.

| Profile            | Viewport                  |
| ------------------ | ------------------------- |
| `desktop-chromium` | 1440 × 900                |
| `tablet-chromium`  | 768 × 1024, touch enabled |
| `mobile-chromium`  | Pixel 5 emulation         |

The suite checks portal selection, credentials, login for all four roles, route redirects, logout, and responsive login and doctor dashboard layouts. Tests fail if the app attempts backend requests. The suite does not cover live API integration or the complete trial lifecycle.
