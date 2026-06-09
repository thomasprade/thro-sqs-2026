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

1. **Basic Authentication** — using HTTP Basic Auth with a username and password stored in the database
2. **Shared Secret** — using a static API key or token that clients must include in requests
3. **JWT Authentication** — implementing JSON Web Tokens for stateless authentication

## Decision Outcome

We decided to implement **JWT Authentication** for the secured endpoint. This approach provides a more robust and scalable solution compared to Basic Auth or a Shared Secret, while still being feasible to implement within the project timeline. JWTs allow for stateless authentication, meaning the server does not need to maintain session state, and they can include additional claims for more complex authorization logic in the future.

### Consequences

Positive:

- Provides a secure and scalable authentication mechanism
- Allows for future extensibility with additional claims and roles
- Reflects common practices in modern web application security

Negative:

- Requires additional implementation effort compared to Basic Auth or a Shared Secret
- Introduces complexity in token management and validation

## More Information

- [JWT Authentication in NestJS](https://docs.nestjs.com/security/authentication#jwt-token)
- We decided not to implement any signup or user management features, as the course requirements only specify a single secured endpoint. Instead, we provide a simple script to create a user in the database for testing purposes.
