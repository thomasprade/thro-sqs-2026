# Glossary

The domain and technical terms used throughout this documentation.

| Term             | Definition                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ADR              | Architecture Decision Record; a short document capturing one decision (see chapter [09](09_architecture_decisions.md)). |
| `ApiResponse<T>` | The response envelope `{ data, message? }` returned by the API (`DELETE` returns bare `{ message }`).                   |
| arc42            | The template used to structure this architecture documentation.                                                         |
| `AuthGuard`      | The global guard that protects every route by default; routes opt out with `@Public()`.                                 |
| Home cook        | The target user — someone organizing personal recipes through a minimalistic UI.                                        |
| Ingredient       | A single item of a recipe with a name, amount and unit.                                                                 |
| JWT              | JSON Web Token; the stateless bearer token used to authenticate write requests.                                         |
| Portion scaling  | Multiplying ingredient amounts by a portion count; done client-side in the frontend.                                    |
| Recipe           | A cooking recipe with a title, description, author and a list of ingredients.                                           |
| SQLite           | The file-based relational database used for persistence (`DATABASE_PATH`).                                              |
| TypeORM          | The object-relational mapper used to access the SQLite database.                                                        |
