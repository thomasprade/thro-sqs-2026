---
status: Accepted
date: 2026-05-21
deciders: Thomas, ypw
---

# AD: Layered Architecture as Core Architecture for this Project

## Context and Problem Statement

Which architecture do we want to use for our project?

## Decision Drivers

- Desire to divide the overall system into manageable parts to reduce complexity
- Ability to exchange system parts without affecting others
- Simple architecture with little overhead given the small project size

## Considered Options

1. Layered Architecture
1. Hexagonal Architecture

## Decision Outcome

We decided to use the layered architecture pattern as it is simple with little overhead.
This project is small and we do not intend to maintain it beyond the scope of this course, so the advantages of a hexagonal architecture with exchangeable adapters are not used.
Therefore the overhead of using hexagonal architecture is not justified.

### Consequences

Positive:

- simple and working architecture
- easy to develop
- easy to understand in small projects

Negative:

- hard to exchange components
- hard to maintain should the project continue to grow

## More Information
