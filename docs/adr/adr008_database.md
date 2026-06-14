---
status: Accepted
date: 2026-06-14
deciders: Thomas, ypw
---

# AD: SQLite as Database for This Project

## Context and Problem Statement

Which database should be used for this project? The backend is implemented in TypeScript using NestJS and TypeORM (see [ADR 006](adr006_chosen_languages_and_frameworks.md)). The data model has a relational nature (recipes composed of ingredients), so a relational database is preferred.

## Decision Drivers

- Relational data model (recipes with ingredients) calls for a relational database
- No database server required for local development
- Suitable for e2e and integration tests without external infrastructure
- Easy to inspect database contents during development
- Simple docker setup (see [ADR 005](adr005_docker_setup%20copy%202.md))
- TypeORM abstracts the underlying database, making future replacement straightforward

## Considered Options

1. SQLite
2. PostgreSQL
3. MariaDB
4. MongoDB

## Decision Outcome

We chose SQLite as the database. TypeORM provides excellent abstraction over the actual database engine, so SQLite can be replaced with another relational database (e.g. PostgreSQL or MariaDB) with minimal impact on the codebase if needed for production deployment.

MongoDB was ruled out early because the relational nature of the data (recipes referencing ingredients) is a natural fit for a relational model and does not benefit from a document store.

### Consequences

Positive:

- No database server required for local development or testing
- E2e and backend integration tests run without any external service
- Docker setup remains simple; `sqlite-web` can be used for easy database inspection
- Switching to a production-grade RDBMS (e.g. PostgreSQL) requires only a TypeORM configuration change

Negative:

- SQLite is not suitable for high-concurrency production workloads
- Some advanced SQL features available in PostgreSQL/MariaDB are not supported by SQLite

## More Information

- TypeORM database abstraction: [ADR 004](adr004_orm.md)
- Docker setup: [ADR 005](adr005_docker_setup%20copy%202.md)
- Language and framework choices: [ADR 006](adr006_chosen_languages_and_frameworks.md)
