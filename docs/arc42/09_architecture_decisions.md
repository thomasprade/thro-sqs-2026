# Architecture Decisions

Significant architecture decisions are recorded as Architecture Decision Records (ADRs) in the
`docs/adr/` directory. Each ADR captures the context, the options considered, the chosen outcome
and its consequences. The table below summarizes them; the key technology
choices are also reflected in the solution strategy (chapter [04](04_solution_strategy.md)).

| ADR                                           | Decision                           | Outcome                                                     | Status   |
| --------------------------------------------- | ---------------------------------- | ----------------------------------------------------------- | -------- |
| [ADR-001](../adr/adr001_core_architecture.md) | Core architecture pattern          | Layered architecture (over hexagonal)                       | Accepted |
| [ADR-002](../adr/adr002_secure_endpoint.md)   | Technology for the secure endpoint | JWT bearer authentication (over Basic Auth / shared secret) | Accepted |
| [ADR-003](../adr/adr003_node_version.md)      | Node.js runtime version            | Node v24 (over v26)                                         | Accepted |
