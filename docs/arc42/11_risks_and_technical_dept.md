# Risks and Technical Debt

Identified risks and technical debt, ordered by priority, with suggested measures.

## Technical Risks

| Risk                                   | Description                                                                                | Mitigation                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Weak JWT secret in production          | The secret falls back to a hardcoded dev value if `JWT_SECRET` is unset.                   | `JWT_SECRET` is required in production; keep it out of version control.       |
| Schema auto-sync (`synchronize: true`) | TypeORM derives the schema from entities and will silently drop columns on entity changes. | Acceptable for this prototype; introduce migrations if the project continues. |
| Heavy usage of open-source components  | npm packages are prone to supply-chain attacks.                                            | Lockfile-pinned installs; static analysis and dependency review in CI.        |
| Single SQLite file / single node       | No replication or automated backups; the file is a single point of failure.                | Sufficient for the project scope; back up the `./data` volume if needed.      |

## Technical Debt

| Item                                  | Description                                                                                                     | Suggested measure                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| PDF export not implemented            | UC-03 is documented but not yet built (requirement #4); no backend endpoint or external API integration exists. | Implement the export endpoint with the planned fail-safe call.  |
| Hardcoded CORS origin                 | The allowed origin is hardcoded to `http://localhost:5173` in `main.ts`.                                        | Move to configuration if more origins are needed.               |
| `DELETE` breaks the response envelope | `DELETE` returns a bare `{ message }` instead of `ApiResponse<T>` (a documented HACK).                          | Normalize the envelope across all verbs if consistency matters. |

## Business or Domain Risk

| Risk                         | Description                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| System might become obsolete | The system is minimalistic and offers only small benefits over pen-and-paper management. |
