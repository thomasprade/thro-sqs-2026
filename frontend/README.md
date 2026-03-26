# Frontend

React single-page application built with **Vite** and **TypeScript**. Provides a simple UI for managing todos via the backend REST API.

## Structure

```
frontend/
├── src/
│   ├── main.tsx                  React entrypoint
│   ├── App.tsx                   Root component (state management, API calls)
│   ├── api.ts                    API client functions (fetch-based)
│   ├── index.css                 Global styles
│   ├── test-setup.ts             Vitest setup (jest-dom matchers)
│   └── components/
│       ├── TodoList.tsx           Renders the list of todos
│       ├── AddTodoForm.tsx        Form for creating new todos
│       └── __tests__/
│           ├── TodoList.test.tsx  Unit test
│           └── AddTodoForm.test.tsx Unit test
├── e2e/
│   └── todo.spec.ts              Playwright UI tests
├── index.html                    SPA entry HTML
├── vite.config.ts                Vite config (React plugin, API proxy)
├── vitest.config.ts              Vitest config (jsdom, React Testing Library)
├── playwright.config.ts          Playwright config for UI tests
├── tsconfig.json
├── nginx.conf                    Production nginx config (SPA + API proxy)
├── Dockerfile
└── package.json
```

## Components

### `App.tsx`

The root component. Manages todo state and coordinates API calls:

- Fetches todos on mount
- Handles creating, toggling (complete/incomplete), and deleting todos
- Displays loading and error states

### `TodoList.tsx`

Renders the list of todos. Each item shows:

- A checkbox to toggle completion
- The todo title (with strikethrough when completed)
- A delete button

Shows an empty-state message when there are no todos.

### `AddTodoForm.tsx`

A controlled form with a text input and submit button:

- Trims whitespace from the title
- Disables submission when the input is empty or a request is in progress
- Clears the input after successful submission

## API Client (`api.ts`)

Fetch-based functions that call the backend REST API. In development, Vite proxies `/api` requests to `http://localhost:3000`.

| Function              | HTTP Method | Endpoint         | Description       |
| --------------------- | ----------- | ---------------- | ----------------- |
| `fetchTodos()`        | GET         | `/api/todos`     | Fetch all todos   |
| `createTodo(dto)`     | POST        | `/api/todos`     | Create a new todo |
| `updateTodo(id, dto)` | PUT         | `/api/todos/:id` | Update a todo     |
| `deleteTodo(id)`      | DELETE      | `/api/todos/:id` | Delete a todo     |

## npm Scripts

| Script               | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `npm run dev`        | Start Vite dev server on port 5173 with hot reload            |
| `npm run build`      | Type-check with `tsc -b`, then build for production with Vite |
| `npm run preview`    | Serve the production build locally                            |
| `npm run test`       | Run unit tests once with Vitest                               |
| `npm run test:watch` | Run unit tests in watch mode                                  |
| `npm run test:e2e`   | Run Playwright UI tests                                       |

When running from the repository root:

```bash
npm run test -w frontend
npm run test:e2e -w frontend
```

## Testing

### Unit Tests (Vitest + React Testing Library)

Located in `src/components/__tests__/`. Uses `jsdom` as the test environment and `@testing-library/jest-dom` for DOM assertion matchers.

**TodoList.test.tsx** — tests:

- Rendering the empty state
- Rendering a list of todos
- Completed todos displaying with strikethrough
- Calling `onToggle` when a checkbox is clicked
- Calling `onDelete` when a delete button is clicked

**AddTodoForm.test.tsx** — tests:

- Rendering the input and submit button
- Submit button being disabled when the input is empty
- Calling `onAdd` with the trimmed title on form submission
- Clearing the input after a successful submit

Run: `npm run test`

### UI Tests (Playwright)

Located in `e2e/todo.spec.ts`. These tests run against the actual application in a real Chromium browser. The Playwright config (`playwright.config.ts`) starts both the frontend and backend dev servers automatically via the `webServer` option.

**Test scenarios:**

- App title is displayed
- Adding a new todo
- Toggling a todo (checking strikethrough styling)
- Deleting a todo

Run: `npm run test:e2e`

> **Note:** Playwright browsers must be installed first: `npx playwright install chromium`

## Development Proxy

In development, Vite proxies API requests to the backend. This is configured in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

This means the frontend can call `/api/todos` without knowing the backend's real host — the same path works in both dev and production (where nginx handles the proxy).

## Docker

The `Dockerfile` uses a multi-stage build:

1. **Builder stage** — installs dependencies, builds shared types and the frontend with Vite
2. **Production stage** — serves the static `dist/` files with `nginx:alpine`

The `nginx.conf` handles:

- Serving the SPA with fallback to `index.html` for client-side routing
- Proxying `/api/` requests to the `backend` Docker service
