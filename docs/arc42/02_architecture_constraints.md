# Architecture Constraints

Requirements that constrain the team's design and implementation freedom. The Recipe App must
respect the following technical and organizational constraints.

## Technical Constraints

| Constraint            | Explanation                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| TypeScript only       | All application code (backend, frontend, shared types) is written in TypeScript.                     |
| Node.js 24            | Runtime is pinned to Node 24 (`mise.toml` / `.nvmrc`); see [ADR-003](../adr/adr003_node_version.md). |
| Platform independent  | Runs on Linux, macOS and Windows; no OS-specific dependencies.                                       |
| Layered architecture  | The system follows a layered architecture; see [ADR-001](../adr/adr001_core_architecture.md).        |
| Runnable from the CLI | The app can be started entirely from the command line, without an IDE.                               |
| Setup in ≤ 2 commands | The app is installable and runnable with at most two commands (`docker compose up --build`).         |

## Organizational Constraints & Conventions

| Constraint           | Explanation                                                                             |
| -------------------- | --------------------------------------------------------------------------------------- |
| Public repository    | The source code is hosted in a public GitHub repository.                                |
| SQA standards        | The project adheres to the software quality standards covered in the lecture.           |
| Test coverage ≥ 80 % | Static code analysis requires a minimum of 80 % test coverage and no open issues.       |
| Decisions as ADRs    | Significant architecture decisions are recorded as ADRs in `docs/adr/`.                 |
| Documentation hosted | The arc42 documentation is written in Markdown and published on ReadTheDocs via MkDocs. |
