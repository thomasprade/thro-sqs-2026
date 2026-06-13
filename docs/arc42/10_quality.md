# Quality Requirements

The most important quality requirements are the three quality goals in chapter
[01](01_introduction_and_goals.md). This chapter restates them as an overview and makes them
concrete and measurable through quality scenarios.

## Quality Requirements Overview

| Quality Attribute (ISO 25010) | Requirement                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| Reliability                   | Recipes and ingredients are displayed accurately; the app stays usable when the PDF API is down.         |
| Performance Efficiency        | Fast startup and responsive in-app actions.                                                              |
| Security                      | Write operations require a valid JWT; unauthenticated writes are rejected.                               |
| Maintainability               | _Nice-to-have:_ shared types as a single contract and ≥ 80 % test coverage keep the code easy to change. |
| Portability                   | _Nice-to-have:_ runs on Linux, macOS and Windows with no OS-specific dependencies.                       |
| Usability                     | _Nice-to-have:_ a minimalistic, clean UI for the home cook.                                              |

## Quality Scenarios

| ID    | Attribute       | Scenario (stimulus → response & measure)                                                                                                  |
| ----- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| QS-01 | Performance     | A user opens the app → it is interactive in under 2 s; any in-app action except PDF generation responds in under 1 s.                     |
| QS-02 | Reliability     | A user requests a PDF while the external PDF API is unavailable → the request fails gracefully and the rest of the app stays usable.      |
| QS-03 | Security        | An unauthenticated client sends a write request (`POST`/`PUT`/`DELETE`) → the backend rejects it with `401 Unauthorized`.                 |
| QS-04 | Maintainability | A developer adds a field to a domain type in `@app/shared` → frontend and backend pick it up from the single contract with no divergence. |
| QS-05 | Portability     | A developer runs `docker compose up --build` on any supported OS → the full stack starts with no OS-specific changes.                     |
