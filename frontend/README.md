# Frontend

React 19 single-page application (Vite + TypeScript + MUI) that provides the UI
for the Recipe app. This README covers the UI development workflow, for
general project setup, environment variables, and Docker deployment see the
[root README](../README.md).

## Tech stack

- React 19 with react-router 7 (`createBrowserRouter`) for client-side routing
- Vite as the dev server and build tool (`@vitejs/plugin-react`)
- TypeScript
- MUI (`@mui/material` + `@mui/icons-material`) for components, styled with
  Emotion (`@emotion/react` / `@emotion/styled`) under the hood
- State: React Context + `useState` (auth lives in `src/auth/AuthContext.tsx`) —
  no external state library
- API: a small fetch-based client (`src/api.ts`)

## Development

```bash
npm install
npm run dev          # frontend only, on http://localhost:5173
```

Or run the frontend and backend together from the repository root with
`npm run dev` (the Vite dev server proxies `/api` to the backend on `:3000`).

The frontend needs no environment variables of its own — all configuration
lives in `vite.config.ts`.

> Before running the Playwright tests, install the browser once:
> `npx playwright install chromium`.

## Folder structure

```
frontend/
├── src/
│   ├── main.tsx            React entry point + router setup
│   ├── api.ts              Fetch-based backend API client
│   ├── index.css           Global styles
│   ├── test-setup.ts       Vitest setup (jest-dom matchers)
│   ├── auth/               Auth context + token handling
│   ├── components/         Reusable UI components (+ __tests__/)
│   └── pages/              Route-level page components (+ __tests__/)
├── e2e/
│   └── mocks/              In-memory mock backend for Playwright tests
├── vite.config.ts          Vite config (React plugin, /api dev proxy)
├── vitest.config.ts        Vitest config (jsdom)
├── playwright.config.ts    Playwright config
├── Dockerfile              Production image (build → nginx)
└── nginx.conf              Production nginx (SPA fallback + /api proxy)
```

## Testing

| Script                      | Description                                  |
| --------------------------- | -------------------------------------------- |
| `npm run test`              | Run unit tests once (Vitest)                 |
| `npm run test:watch`        | Run unit tests in watch mode                 |
| `npm run test:e2e`          | Run Playwright UI tests                      |
| `npm run test:e2e:coverage` | Run UI tests with coverage → `coverage-e2e/` |

- Unit tests — Vitest + Testing Library, in `src//__tests__/*.test.{ts,tsx}`,
  running under `jsdom` (setup in `src/test-setup.ts`).
- UI tests — Playwright specs in `e2e/`, run against a mocked backend
  (`e2e/mocks/`) so they need no real server.

## API contract

The frontend talks to the backend over REST under `/api` — in dev, Vite proxies
those requests to `http://localhost:3000` (configured in `vite.config.ts`); in
Docker, nginx forwards them. Request/response types are imported from
`@app/shared`, the single source of truth for the FE/BE contract; successful
responses use the `{ data }` envelope, and the client sends the JWT bearer token
stored in `localStorage`.

## Build & deployment

`npm run build` type-checks and produces a static bundle in `dist/`. In Docker,
nginx serves that bundle and proxies `/api/` to the backend. Deployment details
(ports, compose setup) are covered in the [root README](../README.md).
