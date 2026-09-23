# Pharmatrial

## Table of Contents

- [Project Summary](#project-summary)
- [Technologies Used](#technologies-used)
- [Necessary Tools](#necessary-tools)
- [Application Setup](#application-setup)
  - [Set Up the Development Environment](#set-up-the-development-environment)
  - [Front-end Setup](#front-end-setup)
  - [Back-end Setup](#back-end-setup)
  - [Project Root Setup](#project-root-setup)
  - [Verify the Setup](#verify-the-setup)
- [Demo credentials](#demo-credentials)
- [Demo walkthrough](#demo-walkthrough)
- [Development commands](#development-commands)
- [Data and privacy](#data-and-privacy)
- [Documentation](#documentation)
  - [Developer references](#developer-references)
  - [Role guides](#role-guides)

## Project Summary

Pharmatrial demonstrates a blinded clinical trial workflow across four role-based portals.

The demo supports trial approvals, patient enrollment, CSV import, treatment assignment, dose tracking, and reports. Run it with synthetic seed data or connect the companion backend through `VITE_API_URI`. The `apps.front-end` branch contains the frontend; `apps.back-end` contains the Express API backend.

## Technologies Used


[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-F7D336?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

## Necessary Tools

Install the required tools before setting up the application.

| Tool                                                              | Purpose                                                                                             |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Git](https://git-scm.com/downloads)                              | Clone the project branches.                                                                         |
| [Node.js](https://nodejs.org/)                                    | Run the application and build tools. Use `^20.19.0` or `>=22.12.0`, as specified in `package.json`. |
| [pnpm 10](https://pnpm.io/10.x/installation)                      | Install dependencies and run project commands.                                                      |
| [Visual Studio Code](https://code.visualstudio.com/)   | Edit source and environment files, or use your preferred editor.                                    |
| [PostgreSQL](https://www.postgresql.org/download/) | Store workflow records. Use a local database or a hosted PostgreSQL connection.                     |

## Application Setup

Complete the development environment steps, then choose a setup path:

- **Demo:** Complete Front-end Setup to use synthetic data without a backend.
- **Live API:** Complete Front-end Setup and Back-end Setup, then enable the API connection.
- **Shared workspace:** Start with Project Root Setup to keep both branches in one parent folder.

### Set Up the Development Environment

1. Install Git and a supported Node.js version from [Necessary Tools](#necessary-tools). Verify both installations:

   ```sh
   git --version
   node --version
   npm --version
   ```

2. Install pnpm 10 globally and verify it. This version supports the project's Node.js range; see the [pnpm installation guide](https://pnpm.io/10.x/installation).

   ```sh
   npm install -g pnpm@10
   pnpm --version
   ```

3. Open a terminal in the folder where you want to keep the project. Use VS Code or your preferred editor to edit the environment files below.

### Front-end Setup

1. Clone the frontend branch and enter its folder. If you already have this checkout, open its folder and skip cloning.

   ```sh
   git clone --branch apps.front-end https://github.com/austin-mel/csc131.mock.front-end.git csc131.mock.front-end
   cd csc131.mock.front-end
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Copy the environment template if you have not created a local file.

   PowerShell:

   ```powershell
   Copy-Item environment/.example.front-end.env environment/.front-end.env
   ```

   macOS or Linux:

   ```sh
   cp environment/.example.front-end.env environment/.front-end.env
   ```

4. Set these values in `environment/.front-end.env` to run the demo:

   ```env
   VITE_API_URI=
   VITE_DEMO_MODE=true
   ```

5. Start the application:

   ```sh
   pnpm run dev
   ```

6. Open the local URL Vite prints, usually `http://localhost:5173`. Select a portal and sign in with the [demo credentials](#demo-credentials). Keep the terminal running; press `Ctrl+C` to stop the server.

### Back-end Setup

The backend uses Express, TypeScript, Prisma, and PostgreSQL. Complete these steps to persist workflow data.

1. Open a second terminal in the frontend folder's parent directory. Clone the backend branch into a separate folder:

   ```sh
   git clone --branch apps.back-end https://github.com/austin-mel/csc131.mock.front-end.git csc131.mock.back-end
   cd csc131.mock.back-end
   pnpm install
   ```

2. Create a PostgreSQL database for development and copy the backend environment template.

   PowerShell:

   ```powershell
   Copy-Item environment/.example.back-end.env environment/.back-end.env
   ```

   macOS or Linux:

   ```sh
   cp environment/.example.back-end.env environment/.back-end.env
   ```

3. Edit `environment/.back-end.env` with your database connection and a random signing secret:

   ```env
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   BACK_END_HOST=postgresql://USER:PASSWORD@HOST:5432/DATABASE
   AUTH_TOKEN_SECRET=replace-with-a-random-secret
   AUTH_TOKEN_ISSUER=pharmatrial-backend
   AUTH_TOKEN_AUDIENCE=pharmatrial-frontend
   AUTH_TOKEN_TTL_SECONDS=28800
   ```

   Use your database provider's full connection string, including any SSL options. Match `CORS_ORIGIN` to the frontend URL. Generate a signing secret with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Load the custom environment file, generate the Prisma client, and create tables in your development database:

   ```sh
   pnpm exec dotenv -e environment/.back-end.env -- prisma generate
   pnpm exec dotenv -e environment/.back-end.env -- prisma db push
   ```

5. Start the API and keep this terminal running:

   ```sh
   pnpm run dev
   ```

6. In the frontend checkout, update `environment/.front-end.env`:

   ```env
   VITE_API_URI=http://localhost:3000/api
   VITE_DEMO_MODE=false
   ```

7. Restart Vite, reload the browser, and sign in. Live mode uses database records; a new database starts with no trials. Sign in as Bavaria Admin to create the first trial.

The API handles login at `POST /api/auth/login` and loads workflow data at `GET /api/workflow/snapshot`. See [Architecture](docs/ARCHITECTURE.md#api-routes) for the endpoint list. [Vue Router](src/router/application-routes.ts) defines page routes; [Vite configuration](vite.config.ts) defines environment loading and the development proxy.

### Project Root Setup

To organize both checkouts together, start in an empty parent folder and clone each branch into its own directory:

```sh
mkdir pharmatrial
cd pharmatrial
git clone --branch apps.front-end https://github.com/austin-mel/csc131.mock.front-end.git front-end
git clone --branch apps.back-end https://github.com/austin-mel/csc131.mock.front-end.git back-end
```

Follow [Front-end Setup](#front-end-setup) in `front-end/` and [Back-end Setup](#back-end-setup) in `back-end/`, skipping their clone steps. Keep each environment file in its service's `environment/` directory. The parent folder needs no environment file or dependency installation.

After configuration, run these commands from the parent folder in separate terminals:

```sh
pnpm --dir back-end run dev
```

```sh
pnpm --dir front-end run dev
```

### Verify the Setup

From the frontend folder, build the application and run the browser tests:

```sh
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Run `pnpm preview` to inspect the production build. Browser tests use demo mode; verify live login and trial creation separately when you configure the backend. See [Testing](docs/TESTING.md) for test coverage and Windows command alternatives.

## Demo credentials

Select a portal on the login page, then use its credentials.

| Portal              | Demo user       | Email                   | Password         |
| ------------------- | --------------- | ----------------------- | ---------------- |
| Jane Hopkins Doctor | Dr. Sarah Chen  | `doctor@jh.example`     | `jh-doctor-demo` |
| Jane Hopkins Admin  | Emily Rodriguez | `admin@jh.example`      | `jh-admin-demo`  |
| FDA Admin           | Michael Torres  | `admin@fda.example`     | `fda-demo`       |
| Bavaria Admin       | Anna Keller     | `admin@bavaria.example` | `bavaria-demo`   |

## Demo walkthrough

Use demo mode and follow this order. Log out to switch portals in the same browser tab. Refreshing the page resets local changes and login state.

1. **Bavaria Admin:** Create a trial.
2. **FDA Admin:** Set eligibility criteria and approve the trial.
3. **Jane Hopkins Admin:** Add or import patients, review eligibility, and approve participation. Enroll at least one eligible patient to continue through assignment and dosing.
4. **Bavaria Admin:** Submit batch metadata.
5. **FDA Admin:** Randomize and lock assignments for every eligible patient.
6. **Jane Hopkins Doctor:** Log appointments and record each eligible patient's required doses.
7. **Jane Hopkins Admin:** Confirm dose completion and notify FDA.
8. **FDA Admin:** Publish disclosure. Each portal can then review the report.
9. **Bavaria Admin:** Archive the completed trial. Bavaria can also archive rejected trials and delete them after archiving.

## Development commands

| Task                         | Command               |
| ---------------------------- | --------------------- |
| Build and type-check         | `pnpm build`          |
| Type-check only              | `pnpm run type-check` |
| Preview the production build | `pnpm preview`        |
| Run browser tests            | `pnpm test:e2e`       |

See [Testing](docs/TESTING.md) for browser installation, test profiles, and coverage.

## Data and privacy

The demo uses synthetic trial and patient data. Jane Hopkins roles can view personally identifiable information (PII); FDA and Bavaria views mask names and dates of birth. The interface hides treatment assignments from Jane Hopkins and Bavaria until FDA publishes disclosure.

Demo changes stay in memory. Frontend masking controls display only; a production backend must enforce authorization, protect PII, and persist records.

## Documentation

### Developer references

| Document                                   | Use it to                                                            |
| ------------------------------------------ | -------------------------------------------------------------------- |
| [Architecture](docs/ARCHITECTURE.md)       | Understand runtime modes, API routes, state, and privacy boundaries. |
| [Data dictionary](docs/DATA_DICTIONARY.md) | Look up fields, types, and workflow values.                          |
| [Testing](docs/TESTING.md)                 | Run build checks and browser tests.                                  |

### Role guides

| Guide                                   | Use it to                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------- |
| [Bavaria Admin](docs/BAVARIA.md)        | Create trials, submit batches, and manage closed records.                  |
| [FDA Administrator](docs/FDA.md)        | Approve trials, set eligibility, lock assignments, and publish disclosure. |
| [Jane Hopkins Admin](docs/JHADMIN.md)   | Enroll patients, approve participation, monitor dosing, and notify FDA.    |
| [Jane Hopkins Doctor](docs/JHDOCTOR.md) | Update patient records, log appointments, and record doses.                |

The [original requirements](docs/REQUIREMENTS.html) preserve historical scope. Use the Markdown guides for current behavior.
