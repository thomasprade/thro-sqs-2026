# Backend

NestJS REST API serving the Todo application. Uses **TypeORM** with **SQLite** (via `better-sqlite3`) for persistence.

## Structure

```
backend/
├── src/
│   ├── main.ts                    Application entrypoint
│   ├── app.module.ts              Root module (TypeORM + TodoModule)
│   └── todo/
│       ├── todo.module.ts         Feature module
│       ├── todo.entity.ts         TypeORM entity
│       ├── todo.service.ts        Business logic (CRUD)
│       ├── todo.controller.ts     REST endpoints
│       ├── dto.ts                 Validation DTOs (class-validator)
│       ├── todo.service.spec.ts   Unit test (service)
│       └── todo.controller.spec.ts Unit test (controller)
├── test/
│   ├── todo.e2e-spec.ts           E2E tests (Supertest)
│   └── jest-e2e.json              Jest config for e2e tests
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.js
├── Dockerfile
└── package.json
```

## API Endpoints

All endpoints are prefixed with `/api/todos`.

| Method   | Path             | Description       | Request Body                              | Response              |
| -------- | ---------------- | ----------------- | ----------------------------------------- | --------------------- |
| `GET`    | `/api/todos`     | List all todos    | —                                         | `{ data: Todo[] }`    |
| `GET`    | `/api/todos/:id` | Get a single todo | —                                         | `{ data: Todo }`      |
| `POST`   | `/api/todos`     | Create a todo     | `{ title: string }`                       | `{ data: Todo }`      |
| `PUT`    | `/api/todos/:id` | Update a todo     | `{ title?: string, completed?: boolean }` | `{ data: Todo }`      |
| `DELETE` | `/api/todos/:id` | Delete a todo     | —                                         | `{ message: string }` |

All responses follow the `ApiResponse<T>` shape defined in `@app/shared`.

## npm Scripts

| Script               | Description                                         |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Start in watch mode (auto-restarts on file changes) |
| `npm run build`      | Compile to `dist/` via NestJS CLI                   |
| `npm run start`      | Start the compiled app from `dist/main`             |
| `npm run start:prod` | Alias for `start` (production)                      |
| `npm run test`       | Run unit tests with Jest                            |
| `npm run test:e2e`   | Run e2e tests with Jest + Supertest                 |

When running from the repository root, use the `-w` flag:

```bash
npm run test -w backend
npm run test:e2e -w backend
```

## Configuration

### Database

SQLite database location is controlled by the `DATABASE_PATH` environment variable:

| Context     | Value                       | Notes                             |
| ----------- | --------------------------- | --------------------------------- |
| Development | `./data/database.sqlite`    | Default, relative to backend root |
| Docker      | `/app/data/database.sqlite` | Set in `docker-compose.yml`       |
| E2E tests   | `:memory:` or temp file     | In-memory for isolation           |

TypeORM is configured with `synchronize: true`, meaning the schema is automatically created/updated from entities on startup. This is suitable for development — for production use, consider switching to migrations.

### CORS

CORS is enabled for `http://localhost:5173` (the Vite dev server), configured in `src/main.ts`.

### Validation

A global `ValidationPipe` is enabled with:

- **`whitelist: true`** — strips properties not defined in the DTO
- **`transform: true`** — auto-transforms payloads to DTO class instances

## Testing

### Unit Tests

Located alongside source files as `*.spec.ts`. Each test uses NestJS's `Test.createTestingModule` to wire up the module with mocked dependencies.

- **`todo.service.spec.ts`** — tests service methods with a mocked TypeORM repository
- **`todo.controller.spec.ts`** — tests controller methods with a mocked service

Run: `npm run test`

### E2E Tests

Located in `test/todo.e2e-spec.ts`. Uses `@nestjs/testing` to bootstrap the full application with an **in-memory SQLite database** and `supertest` to make real HTTP requests.

Covers the complete request/response cycle:

- Creating, reading, updating, and deleting todos
- Input validation (rejecting empty titles)
- Not-found handling (404 for deleted items)

Run: `npm run test:e2e`

## Docker

The `Dockerfile` uses a multi-stage build:

1. **Builder stage** — installs dependencies, builds shared types, then compiles the NestJS app
2. **Production stage** — copies only compiled output and `node_modules`, runs with `node dist/main.js`

The SQLite database file is stored at `/app/data/database.sqlite` inside the container, mapped to `./data/` on the host via Docker Compose.

## TypeORM: Entities & Migrations

### Current Setup (Auto-Sync)

The app is configured with `synchronize: true` in `src/app.module.ts`. This means TypeORM automatically creates and alters database tables to match entity definitions on every startup. This is convenient for development but **should not be used in production** — it can cause data loss when columns are removed or renamed.

### Entities

Entities are TypeORM classes decorated with `@Entity()` that map directly to database tables. They live alongside their feature module (e.g. `src/todo/todo.entity.ts`).

**To add or modify an entity:**

1. Edit or create the entity file using TypeORM decorators:

   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity('my_table')
   export class MyEntity {
     @PrimaryGeneratedColumn()
     id!: number;

     @Column()
     name!: string;

     @Column({ nullable: true })
     description?: string;
   }
   ```

2. Register the entity in `src/app.module.ts` by adding it to the `entities` array:

   ```typescript
   TypeOrmModule.forRoot({
     // ...
     entities: [TodoEntity, MyEntity],
   }),
   ```

3. With `synchronize: true`, the table is created/updated automatically on the next restart.

### Common Entity Decorators

| Decorator                       | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `@Entity('name')`               | Marks a class as a DB table               |
| `@PrimaryGeneratedColumn()`     | Auto-incrementing primary key             |
| `@Column()`                     | Regular column (string, number, boolean)  |
| `@Column({ default: value })`   | Column with a default value               |
| `@Column({ nullable: true })`   | Nullable column                           |
| `@CreateDateColumn()`           | Auto-set to current timestamp on insert   |
| `@UpdateDateColumn()`           | Auto-updated to current timestamp on save |
| `@ManyToOne()` / `@OneToMany()` | Relation decorators for foreign keys      |

### Switching to Migrations (Production)

When you're ready to move away from auto-sync (recommended for any shared or deployed database):

**1. Create a data source config file** (`src/data-source.ts`):

```typescript
import { DataSource } from 'typeorm';
import { TodoEntity } from './todo/todo.entity';

export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH || './data/database.sqlite',
  entities: [TodoEntity],
  migrations: ['./migrations/*.ts'],
});
```

**2. Disable auto-sync** in `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  // ...
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true, // auto-run pending migrations on startup
}),
```

**3. Generate a migration** from entity changes:

```bash
npx typeorm migration:generate -d src/data-source.ts migrations/InitialSchema
```

This compares your current entities against the database and generates a migration file with the required SQL.

**4. Create an empty migration** (for manual SQL):

```bash
npx typeorm migration:create migrations/AddUserTable
```

**5. Run pending migrations:**

```bash
npx typeorm migration:run -d src/data-source.ts
```

**6. Revert the last migration:**

```bash
npx typeorm migration:revert -d src/data-source.ts
```

### Migration Workflow Summary

| Command                                                      | Description                              |
| ------------------------------------------------------------ | ---------------------------------------- |
| `migration:generate -d src/data-source.ts migrations/<Name>` | Auto-generate migration from entity diff |
| `migration:create migrations/<Name>`                         | Create empty migration for manual SQL    |
| `migration:run -d src/data-source.ts`                        | Run all pending migrations               |
| `migration:revert -d src/data-source.ts`                     | Revert the most recent migration         |

All commands are prefixed with `npx typeorm` and should be run from the `backend/` directory.
