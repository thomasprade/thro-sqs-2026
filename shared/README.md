# @app/shared

Shared TypeScript type definitions used by both the **backend** and **frontend** workspaces. This package acts as the single source of truth for API contracts, ensuring type safety across the full stack.

## Contents

```
shared/
├── src/
│   ├── index.ts              Barrel export
│   └── types/
│       └── todo.ts           Todo-related types and DTOs
├── dist/                     Compiled output (generated)
├── package.json
└── tsconfig.json
```

## Exported Types

All types are defined in `src/types/todo.ts` and re-exported from `src/index.ts`:

| Type             | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `Todo`           | Full todo object as returned by the API (`id`, `title`, `completed`, `createdAt`, `updatedAt`) |
| `CreateTodoDto`  | Request body for creating a todo (`title`)                                                     |
| `UpdateTodoDto`  | Request body for updating a todo (optional `title`, `completed`)                               |
| `ApiResponse<T>` | Generic wrapper for all API responses (`data`, optional `message`)                             |

## npm Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run clean` | Remove the `dist/` directory  |

## How It Works

- The package is published internally as `@app/shared` via npm workspaces — no npm registry needed.
- **Backend** imports the compiled output from `dist/` (resolved through `node_modules`).
- **Frontend** imports directly from `src/` via a TypeScript path alias and Vite alias, so changes are picked up immediately without rebuilding.
- The shared package must be built (`npm run build -w shared`) before running backend tests or builds. The root `npm run setup` script handles this automatically.

## Adding New Types

1. Create a new file in `src/types/` (e.g. `src/types/user.ts`)
2. Export the new types from `src/index.ts`:
   ```typescript
   export * from './types/user';
   ```
3. Rebuild: `npm run build -w shared`
4. Import in backend or frontend: `import type { User } from '@app/shared';`
