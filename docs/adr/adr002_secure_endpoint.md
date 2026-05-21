---
status: Accepted
date: 2026-05-05
deciders: Thomas, dtke, ypw, f.rampf
---

_TODO:_ rewrite less passive aggressive

# AD: Used Technology for the Secure Endpoint

## Context and Problem Statement

Which technology should be used for the secured endpoint, required by the course requirements?

## Decision Drivers

- Course requirements state that a secure endpoint is required
- First suggested technology (pre-shared key) was accepted at begin of system design phase
- Upon further discussion with the instructor technology was criticized as potentially to simple, judgment would depend heavily on implementation

## Considered Options

1. pre-shared key
1. basic auth

## Decision Outcome

We decided to use basic auth.
If everybody does it, well then so shall we.

### Consequences

Good:

- easy
- everybody does it
- nothing was jet implemented

Bad:

- change in design concept

## More Information
