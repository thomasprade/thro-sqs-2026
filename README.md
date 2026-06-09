# SQS Todo App

A full-stack TypeScript monorepo demonstrating software quality assurance practices. Built with **React**, **NestJS**, and **SQLite**, featuring comprehensive testing at every level — unit tests, UI tests, end-to-end tests, and full-stack integration tests.

[![Read the Docs](https://app.readthedocs.org/projects/sqs-recipe-app/badge/?version=latest&style=for-the-badge)](https://sqs-recipe-app.readthedocs.io/en/latest/)

![CI](https://github.com/thomasprade/thro-sqs-2026/actions/workflows/ci.yml/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=bugs)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=coverage)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=thomasprade_thro-sqs-2026&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=thomasprade_thro-sqs-2026)

## Repository Structure

```text
├── shared/          Shared TypeScript types (API contracts)
├── backend/         NestJS REST API with SQLite (TypeORM)
├── frontend/        React SPA (Vite)
├── e2e/             Full-stack integration tests (Playwright)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

Each directory has its own README with more details:

- [shared/README.md](shared/README.md) — shared type definitions
- [backend/README.md](backend/README.md) — REST API server
- [frontend/README.md](frontend/README.md) — React frontend

## Prerequisites

- **Node.js 24** (see `.nvmrc` or `mise.toml`)
- **npm** (ships with Node)
- **Docker & Docker Compose** (for containerised local setup)

## Quick Start

### Development Mode

```bash
# Install dependencies and build shared types
npm run setup

# Start frontend (localhost:5173) and backend (localhost:3000) together
npm run dev
```

The frontend dev server proxies `/api` requests to the backend automatically.

### Docker Mode

```bash
# Build and start all containers
docker compose up --build
```

| Service    | URL                                            |
| ---------- | ---------------------------------------------- |
| Frontend   | [http://localhost:8080](http://localhost:8080) |
| Backend    | [http://localhost:3000](http://localhost:3000) |
| sqlite-web | [http://localhost:8081](http://localhost:8081) |

SQLite data is persisted to the `./data/` directory on the host via a Docker volume.

### Creating Users

Use the backend workspace script to add a user to the local development database in `backend/data/database.sqlite`:

```bash
npm run create-user -w backend -- testuser testpass
```

Use the root script to add a user to the database shared with Docker in `./data/database.sqlite`:

```bash
npm run create-user:docker -- testuser testpass
```

In both commands, replace `testuser testpass` with the username and password you want to store.

## npm Scripts (Root)

All scripts are run from the repository root.

| Script                       | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `npm run setup`              | Install all dependencies and build shared types             |
| `npm run dev`                | Start frontend and backend in watch mode (via concurrently) |
| `npm run build`              | Build shared → backend → frontend (production)              |
| `npm run test`               | Run backend + frontend **unit tests**                       |
| `npm run test:e2e`           | Run backend e2e + frontend Playwright UI tests              |
| `npm run test:integration`   | Run full-stack integration tests (Playwright)               |
| `npm run test:all`           | Run all of the above tests sequentially                     |
| `npm run create-user:docker` | Create a backend user in the Docker-shared SQLite database  |
| `npm run lint`               | Lint all workspaces with ESLint                             |
| `npm run format:check`       | Check formatting with Prettier                              |
| `npm run format`             | Auto-fix formatting with Prettier                           |

## Testing Strategy

This project implements a multi-layered testing approach:

```text
┌─────────────────────────────────────────────┐
│    Full-Stack Integration Tests (e2e/)      │  Playwright — real browser,
│    Frontend ↔ Backend ↔ Database            │  real servers, real DB
├─────────────────────────────────────────────┤
│    Frontend UI Tests (frontend/e2e/)        │  Playwright — browser tests
│    Backend E2E Tests (backend/test/)        │  Supertest — HTTP-level tests
├─────────────────────────────────────────────┤
│    Frontend Unit Tests (Vitest)             │  Component tests with
│    Backend Unit Tests (Jest)                │  React Testing Library / mocks
└─────────────────────────────────────────────┘
```

| Layer       | Tool                     | Location                     | What it tests                              |
| ----------- | ------------------------ | ---------------------------- | ------------------------------------------ |
| Unit (BE)   | Jest                     | `backend/src/**/*.spec.ts`   | Services and controllers with mocks        |
| Unit (FE)   | Vitest + Testing Library | `frontend/src/**/*.test.tsx` | React components in isolation              |
| E2E (BE)    | Jest + Supertest         | `backend/test/*.e2e-spec.ts` | Full HTTP request/response cycle           |
| UI (FE)     | Playwright               | `frontend/e2e/*.spec.ts`     | User interactions in a real browser        |
| Integration | Playwright               | `e2e/tests/*.spec.ts`        | Complete user flows through the full stack |

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests. It consists of four parallel jobs:

1. **Lint & Format** — ESLint + Prettier checks
2. **Backend Tests** — unit tests + e2e tests
3. **Frontend Tests** — Vitest unit tests + Playwright UI tests
4. **Full-Stack Integration** — Playwright integration tests (runs after backend and frontend tests pass)

## Tech Stack

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | React 19, Vite, TypeScript                                 |
| Backend  | NestJS 11, TypeORM, better-sqlite3                         |
| Database | SQLite                                                     |
| Testing  | Jest, Vitest, Playwright, Supertest, React Testing Library |
| CI       | GitHub Actions                                             |
| Docker   | Multi-stage builds, nginx, sqlite-web                      |

## Workspaces

This project uses **npm workspaces** to manage the monorepo. The four workspaces are:

- **`shared`** — shared TypeScript types used by both frontend and backend
- **`backend`** — NestJS REST API
- **`frontend`** — React SPA
- **`e2e`** — full-stack integration tests

You can run any workspace-specific command from the root using the `-w` flag:

```bash
npm run test -w backend      # run only backend tests
npm run dev -w frontend      # start only the frontend dev server
npm run build -w shared      # rebuild shared types
```
