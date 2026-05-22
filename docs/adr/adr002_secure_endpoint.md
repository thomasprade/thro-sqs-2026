---
status: Accepted
date: 2026-05-05
deciders: Thomas, dtke, ypw, F. Rampf
---

# AD: Used Technology for the Secure Endpoint

## Context and Problem Statement

Which technology should be used for the secured endpoint, required by the course requirements?

## Decision Drivers

- The system requires at least one secured endpoint
- The chosen solution should be straightforward to implement within the project scope
- The solution should reflect common security practices used in modern web applications
- The architecture should remain extensible for potential future enhancements

## Considered Options

1. Pre-shared key authentication
1. Basic authentication

## Decision Outcome

We decided to use basic auth as authentication-based access control better reflects real-world application architectures and industry-standard security practices.
Introducing authentication early enables future extensibility such as role-based access control, session management, and audit logging.

### Consequences

Positive:

- still not too complicated to implement
- nothing was yet implemented

Negative:

- Slightly higher implementation complexity compared to a shared secret approach
- Requires user credential management
- Introduces additional testing and configuration effort

## More Information
