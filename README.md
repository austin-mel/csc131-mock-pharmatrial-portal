# Pharmatrial Backend

The Pharmatrial backend is an Express and TypeScript API that persists the clinical trial workflow in PostgreSQL through Prisma. It provides authentication, role-gated workflow endpoints, live snapshot hydration for the Vue frontend, audit logging, and privacy-aware response shaping.

The frontend should point `VITE_API_URI` at this server's `/api` base path. For example, if the backend is running on port `3000`, configure the frontend with:

```env
VITE_API_URI=http://localhost:3000/api
VITE_DEMO_MODE=false
```

If the frontend cannot reach this API, it falls back to seeded local data. The backend itself does not serve seeded workflow data; it serves persisted database records and built-in demo login identities.

## Documentation Map

| Read This | When You Need |
|---|---|
| [Architecture Reference](docs/ARCHITECTURE.md) | Runtime configuration, request flow, data model, role gates, and endpoint map. |
| [Prisma Schema](prisma/schema.prisma) | Database tables, relations, indexes, and persisted workflow entities. |

## System Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | Compatible with the installed TypeScript and Express toolchain. |
| Package manager | `pnpm` recommended because the repo includes `pnpm-lock.yaml`. |
| Database | PostgreSQL-compatible connection string in `BACK_END_HOST`; Neon is supported. |
| Frontend | Pharmatrial Vue app configured with this API base URL. |

## Setup

Install dependencies:

```sh
pnpm install
```

Create the backend environment file from the example:

```sh
Copy-Item environment\.example.back-end.env environment\.back-end.env
```

Configure `environment/.back-end.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
BACK_END_HOST=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
AUTH_TOKEN_SECRET=replace-with-a-long-random-secret
AUTH_TOKEN_ISSUER=pharmatrial-backend
AUTH_TOKEN_AUDIENCE=pharmatrial-frontend
AUTH_TOKEN_TTL_SECONDS=28800
```

Generate the Prisma client after dependencies and database configuration are available:

```sh
npx prisma generate
```

Apply migrations or push the schema according to your database workflow:

```sh
npx prisma db push
```

Start the development server:

```sh
pnpm dev
```

Build and start production output:

```sh
pnpm build
pnpm start
```

## Runtime Configuration

| Variable | Required | Default | Description |
|---|---:|---|---|
| `PORT` | No | `3000` | HTTP port used by `src/server.ts`. |
| `CORS_ORIGIN` | No | Allow all origins | Comma-separated list of allowed frontend origins. |
| `BACK_END_HOST` | Yes | None | PostgreSQL connection string used by Prisma and Neon helpers. |
| `AUTH_TOKEN_SECRET` | Recommended | Local dev fallback | HMAC secret for signing bearer tokens. Set this in every shared environment. |
| `AUTH_TOKEN_ISSUER` | No | `pharmatrial-backend` | Expected JWT issuer. |
| `AUTH_TOKEN_AUDIENCE` | No | `pharmatrial-frontend` | Expected JWT audience. |
| `AUTH_TOKEN_TTL_SECONDS` | No | `28800` | Token lifetime in seconds. |

Environment variables are loaded from `environment/.back-end.env` by both `src/server.ts` and `src/app.ts`.

## API Overview

All routes are mounted below `/api`.

| Method | Path | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/auth/login` | No | Authenticate a persisted or built-in demo portal user. |
| `GET` | `/workflow/snapshot` | Yes | Return the role-filtered workflow snapshot for the frontend. |
| `POST` | `/workflow/trials` | Yes | Create a Bavaria trial. |
| `POST` | `/workflow/trials/:id/approve` | Yes | Approve a trial as FDA or Jane Hopkins Admin. |
| `POST` | `/workflow/trials/:id/reject` | Yes | Reject a trial as FDA or Jane Hopkins Admin. |
| `POST` | `/workflow/trials/:id/enrollments` | Yes | Add or update a patient enrollment. |
| `POST` | `/workflow/trials/:id/import-patients` | Yes | Import multiple patient enrollment rows. |
| `POST` | `/workflow/trials/:id/appointments` | Yes | Log an appointment or dose event. |
| `POST` | `/workflow/trials/:id/batch` | Yes | Submit Bavaria batch metadata. |
| `POST` | `/workflow/trials/:id/assignments` | Yes | Save FDA treatment/placebo assignments. |
| `POST` | `/workflow/trials/:id/notify-fda` | Yes | Notify FDA after all eligible patients are dosed. |
| `POST` | `/workflow/trials/:id/disclosure` | Yes | Publish FDA disclosure and report rows. |
| `POST` | `/workflow/trials/:id/archive` | Yes | Archive or unarchive a closed Bavaria trial. |
| `DELETE` | `/workflow/trials/:id` | Yes | Delete an archived rejected Bavaria trial. |

`/api/trials/...` is currently aliased to the same workflow router for compatibility.

## Demo Login Identities

These built-in users can authenticate even when there is no matching `PortalUser` row. They are login identities only; workflow records still come from the database.

| Portal | Email | Password |
|---|---|---|
| Jane Hopkins Doctor | `doctor@jh.example` | `jh-doctor-demo` |
| Jane Hopkins Admin | `admin@jh.example` | `jh-admin-demo` |
| FDA Administrator | `admin@fda.example` | `fda-demo` |
| Bavaria Admin | `admin@bavaria.example` | `bavaria-demo` |

## Project Structure

```text
environment/   Backend environment example and local env file location
prisma/        Prisma database schema
src/
  app.ts        Express app, JSON middleware, CORS, and /api mounting
  server.ts     Environment loading and HTTP listener
  auth/         Token signing, verification, and password hashing helpers
  controllers/  Auth and workflow request handlers
  middleware/   Bearer-token authentication and validation helpers
  prisma/       Prisma client singleton
  routes/       Auth and workflow route mounting
  services/     Workflow domain logic and Prisma persistence
  validators/   Legacy validation schemas
```
