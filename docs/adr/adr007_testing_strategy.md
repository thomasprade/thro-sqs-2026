---
status: Accepted
deciders: Thomas, ypw
---

# AD: Testing Strategy

## Context and Problem Statement

Which testing strategy should be used to ensure correctness, security, and architectural conformance of the system, covering both the frontend (FE) and backend (BE)?

## Decision Drivers

- Need for confidence in functional correctness across all layers
- Need to verify that secured endpoints cannot be accessed without authorization
- Need to verify conformance to the layered architecture chosen in [ADR 001](adr001_core_architecture.md)
- Need for sufficient test coverage (target: >90%)
- Static code quality analysis as part of the CI/CD pipeline

## Decision Outcome

The following test types are used:

| Test Type            | Scope                            | Tool(s)                                 |
| -------------------- | -------------------------------- | --------------------------------------- |
| Unit Tests (BE)      | Individual classes/functions     | Jest (bundled with NestJS)              |
| Unit Tests (FE)      | Individual components/functions  | Vitest (default for Vite/React)         |
| E2E Tests (BE)       | REST API endpoints               | Jest + Supertest + Nock                 |
| E2E Tests (FE)       | UI flows in isolation            | Playwright                              |
| Integration Tests    | FE + BE + DB combined            | Playwright                              |
| Penetration Tests    | Secured BE endpoints             | Jest + Supertest (BE E2E + integration) |
| Architecture Tests   | Layered architecture constraints | ArchUnit                                |
| Static Code Analysis | Code quality & security          | SonarCloud (CI pipeline)                |

**Tool selection rationale:**

- **Jest** is used for BE unit and E2E tests because NestJS ships with it as its default test runner, minimizing configuration overhead.
- **Supertest** enables HTTP-level testing of NestJS controllers without a running server. **Nock** is used to mock external HTTP calls in BE E2E tests.
- **Vitest** is used for FE unit tests because Vite (the default React build tool) integrates with it natively.
- **Playwright** is used for FE E2E and integration tests as it is the de-facto standard for browser-based UI testing and supports cross-browser coverage.
- **ArchUnit** is used for architecture tests to enforce layer dependency rules as defined in [ADR 001](adr001_core_architecture.md).
- **SonarCloud** is integrated into the CI pipeline to provide static code analysis, code smell detection, and security vulnerability scanning.

**Penetration testing** is implemented as a dedicated suite of BE E2E tests that assert that all secured endpoints return `401 Unauthorized` when accessed without valid credentials. The login behaviour is further verified in full integration tests via Playwright.

**Coverage target:** >90% line and branch coverage across BE and FE, (>80% enforced in the CI pipeline).

### Consequences

Positive:

- High confidence in functional correctness at all system levels
- Security of protected endpoints is verified automatically on every build
- Architectural layer constraints are enforced as code
- Coverage threshold prevents untested code from being merged
- Static analysis catches quality and security issues early

Negative:

- Higher number of test types increases maintenance effort
- Integration tests require a running DB, adding infrastructure complexity to the pipeline
- Architecture tests must be updated when the architecture intentionally evolves

## More Information

- [ADR 001 – Layered Architecture](adr001_core_architecture.md)
- [ADR 004 – ORM](adr004_orm.md)
- [SonarCloud](https://sonarcloud.io)
