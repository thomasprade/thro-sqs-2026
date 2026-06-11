# Solution Strategy

A short summary of the fundamental decisions that shape the architecture of the Recipe App.
They follow from the quality goals (chapter [01](01_introduction_and_goals.md)) and the
constraints (chapter [02](02_architecture_constraints.md)).

## Technology Decisions

| Decision                     | Rationale                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| TypeScript everywhere        | One language for backend, frontend and shared types reduces context switching.                                     |
| Shared types as the contract | `@app/shared` holds the domain types and DTOs used by both ends, so the API contract cannot drift.                 |
| NestJS backend               | Opinionated, modular framework that fits the layered architecture and provides validation and auth out of the box. |
| React 19 + Vite frontend     | A single-page app with fast dev tooling for a clean, minimalistic UI.                                              |
| TypeORM + SQLite persistence | A single local file database; zero external infrastructure to run or operate.                                      |
| Docker Compose for setup     | The whole stack starts with `docker compose up --build`, meeting the ≤ 2-command setup constraint.                 |

## Decomposition

The system uses a layered architecture (see [ADR-001](../adr/adr001_core_architecture.md))
inside an npm-workspaces monorepo with four packages: `shared` (types), `backend` (NestJS API),
`frontend` (React SPA) and `e2e` (integration tests). The project is small and short-lived, so a
layered design gives clear separation of concerns with little overhead.

## Achieving the Quality Goals

| Quality Goal (chapter [01](01_introduction_and_goals.md)) | Strategy                                                                                                                                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reliability                                               | The local SQLite store gives deterministic reads/writes. Calls to the external PDF API are isolated with a fail-safe fallback so the rest of the app stays usable when it is down.                                                    |
| Performance Efficiency                                    | A single-page app plus a local file database keeps the read path light; recipe and ingredient reads are public, unauthenticated `GET`s.                                                                                               |
| Security                                                  | A global `AuthGuard` protects every route by default; write operations require a JWT bearer token (see [ADR-002](../adr/adr002_secure_endpoint.md)), passwords are bcrypt-hashed, and a global `ValidationPipe` whitelists all input. |

## Organizational Decisions

Significant decisions are recorded as ADRs in `docs/adr/`. The arc42 documentation is written in
Markdown and published on ReadTheDocs via MkDocs. Quality is enforced by static analysis with a
minimum of 80 % test coverage and no open issues (see chapter [02](02_architecture_constraints.md)).
