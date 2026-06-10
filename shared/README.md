# @app/shared

Shared TypeScript type definitions for the **Recipes** domain. This package is the single source of truth for the frontend/backend API contract, so the wire format can never drift between the two.

## Exported Types

All types are re-exported from `src/index.ts`:

| Type                  | Source                     | Description                                                                                   |
| --------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| `Recipe`              | `src/types/recipes.ts`     | A recipe as returned by the API (`id`, `title`, `description`, `author`, timestamps)          |
| `CreateRecipeDto`     | `src/types/recipes.ts`     | Request body for creating a recipe                                                            |
| `UpdateRecipeDto`     | `src/types/recipes.ts`     | Request body for updating a recipe (all fields optional)                                      |
| `Ingredient`          | `src/types/ingredients.ts` | An ingredient as returned by the API (`id`, `recipeId`, `name`, `amount`, `unit`, timestamps) |
| `CreateIngredientDto` | `src/types/ingredients.ts` | Request body for adding an ingredient                                                         |
| `UpdateIngredientDto` | `src/types/ingredients.ts` | Request body for updating an ingredient (all fields optional)                                 |
| `ApiResponse<T>`      | —                          | Generic envelope wrapping every API response (`data`, optional `message`)                     |

## How It's Consumed

`@app/shared` is resolved **directly to source** (`src/index.ts`), so type changes are picked up immediately without a rebuild:

- **Frontend** — via a TypeScript path alias and a Vite alias.
- **Backend** — via a TypeScript path alias and Jest `moduleNameMapper`.

`npm run build -w shared` (run by the root `npm run setup`) compiles `dist/` for any consumer that reads the built output.

## npm Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run clean` | Remove the `dist/` directory  |

## Adding New Types

1. Add the type to a file under `src/types/`.
2. Re-export it from `src/index.ts`: `export * from './types/your-file';`
3. Import it anywhere in the frontend or backend: `import type { Recipe } from '@app/shared';`
