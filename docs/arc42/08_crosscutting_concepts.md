# Crosscutting Concepts

Concepts that apply across several building blocks (chapter [05](05_building_block_view.md)) and
keep the architecture consistent.

## Shared Types as Contract

The `@app/shared` package holds the domain types and DTOs (`Recipe`, `Ingredient`,
`Create*/Update*Dto`). These interfaces are the wire contract used by both ends; the backend
re-declares the DTOs as class-validator classes so the same shapes also carry runtime validation.
This keeps the frontend and backend in sync from a single source of truth.

## Authentication and Authorization

The backend protects every route by default with a global `AuthGuard`; routes opt out with the
`@Public()` decorator (the recipe and ingredient reads, and `POST /api/auth/login`). Authentication
uses stateless **JWT bearer tokens** (HS256, 24 h); the secret comes from `JWT_SECRET` and is
required in production. Passwords are bcrypt-hashed. On the frontend, `AuthContext` stores the token
in `localStorage` and the `api.ts` client sends it as `Authorization: Bearer` on writes. See
[ADR-002](../adr/adr002_secure_endpoint.md).

## Input Validation

A global `ValidationPipe` (`whitelist: true, transform: true`) validates and sanitizes every request
body against the class-validator DTOs before it reaches a controller. Unknown properties are
stripped, and payloads are coerced to their declared types, so services only ever see well-formed
input.

## Persistence

Data is stored in a single SQLite file (`DATABASE_PATH`) accessed through TypeORM repositories.
Entities are defined per feature module, and mappers convert entities to the shared types so
controllers never leak internal fields. `synchronize: true` derives the schema from the entities,
which suits this short-lived project (no migrations); see the deployment view (chapter
[07](07_deployment_view.md)) for where the file lives.

## API Design

The backend exposes a REST API under `/api` (recipes and their nested ingredients). Reads are public
`GET`s; writes (`POST`/`PUT`/`DELETE`) require a JWT. Every successful response uses the
`ApiResponse<T> = { data, message? }` envelope, with one deliberate exception: `DELETE` returns a
bare `{ message }`. Updates use `PUT` (full replacement), not `PATCH`.
