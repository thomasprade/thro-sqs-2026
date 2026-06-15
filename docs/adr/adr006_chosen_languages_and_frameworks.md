---
status: Accepted
deciders: Thomas, ypw
---

# AD: TypeScript for Both Backend and Frontend, with NestJS and React as Frameworks

## Context and Problem Statement

Which programming language and frameworks should be used for the backend and frontend of this project?
The allowed languages were TypeScript, Java, C#/.NET, and Python. Frameworks could be chosen freely.

## Decision Drivers

- Sharing types between backend and frontend reduces duplication and potential inconsistencies
- Switching between backend and frontend code requires less mental context-switching when using the same language
- Unified dependency management and tooling (e.g. a single monorepo setup)
- Team experience and familiarity with the chosen technologies
- Simplicity and appropriate overhead for a project of this size

## Considered Options

**Language:**

1. TypeScript (for both backend and frontend)
2. Java
3. C#/.NET
4. Python

**Backend framework:**

1. NestJS
2. Express / Fastify (plain Node.js frameworks)

**Frontend framework:**

1. React
2. Vue
3. Svelte
4. Angular

## Decision Outcome

We chose **TypeScript** as the language for both backend and frontend, **NestJS** as the backend framework, and **React** as the frontend framework.

Using TypeScript on both sides allows shared type definitions (via the `shared` package), which eliminates an entire class of runtime type mismatches between API and UI. It also reduces the mental effort of switching between layers and simplifies dependency management and testing in a monorepo setup.

NestJS was chosen as the de facto standard for building production-grade backends in TypeScript. The team already had significant experience with it, lowering the ramp-up time.

React was chosen for the frontend due to prior positive team experience and its relatively simple mental model compared to Angular. Vue and Svelte were considered but discarded due to the team's lack of prior experience with them.

Java, C#/.NET, and Python were not chosen as they would require a different language on the backend than the frontend, negating the type-sharing and context-switching benefits.

### Consequences

Positive:

- Types defined in the `shared` package can be used in both backend and frontend, avoiding duplication
- Developers can switch between backend and frontend with minimal cognitive overhead
- Unified tooling and dependency management across the monorepo
- Team hits the ground running with familiar technologies (NestJS, React)

Negative:

- Node.js runtime performance is lower than Java or C# for CPU-intensive workloads (not a concern for this project)
- TypeScript's type system, while powerful, adds some build complexity compared to plain JavaScript

## More Information

- The `shared/` package in the monorepo demonstrates the type-sharing approach enabled by this decision.
- See [ADR 001](adr001_core_architecture.md) for the overall architecture decision that this language choice supports.
