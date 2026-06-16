# Architecture Decisions

Significant architecture decisions are recorded as Architecture Decision Records (ADRs) in the
`docs/adr/` directory. Each ADR captures the context, the options considered, the chosen outcome
and its consequences. The table below summarizes them; the key technology
choices are also reflected in the solution strategy (chapter [04](04_solution_strategy.md)).

| ADR                                                         | Decision                           | Outcome                                                     | Status   |
| ----------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------- | -------- |
| [ADR-001](../adr/adr001_core_architecture.md)               | Core architecture pattern          | Layered architecture (over hexagonal)                       | Accepted |
| [ADR-002](../adr/adr002_secure_endpoint.md)                 | Technology for the secure endpoint | JWT bearer authentication (over Basic Auth / shared secret) | Accepted |
| [ADR-003](../adr/adr003_node_version.md)                    | Node.js runtime version            | Node v24 (over v26)                                         | Accepted |
| [ADR-004](../adr/adr004_orm.md)                             | ORM library                        | TypeORM (over raw SQL)                                      | Accepted |
| [ADR-005](../adr/adr005_docker_setup.md)                    | Docker setup for local demo        | Docker Compose with separate frontend/backend containers    | Accepted |
| [ADR-006](../adr/adr006_chosen_languages_and_frameworks.md) | Language and frameworks            | TypeScript with NestJS (backend) and React (frontend)       | Accepted |
| [ADR-007](../adr/adr007_testing_strategy.md)                | Testing strategy                   | Multi-layer testing (unit, integration, e2e, architecture)  | Accepted |
| [ADR-008](../adr/adr008_database.md)                        | Database                           | SQLite (over PostgreSQL / MariaDB)                          | Accepted |
