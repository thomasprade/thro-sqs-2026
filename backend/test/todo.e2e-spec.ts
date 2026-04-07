import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { TodoEntity } from '../src/todo/todo.entity';
import { TodoModule } from '../src/todo/todo.module';

describe('Todo (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [TodoEntity],
          synchronize: true,
        }),
        TodoModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  it('POST /api/todos — should create a todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'E2E Test Todo' })
      .expect(201);

    expect(res.body.data.title).toBe('E2E Test Todo');
    expect(res.body.data.completed).toBe(false);
    expect(res.body.data.id).toBeDefined();
    createdId = res.body.data.id;
  });

  it('GET /api/todos — should return all todos', async () => {
    const res = await request(app.getHttpServer()).get('/api/todos').expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('E2E Test Todo');
  });

  it('GET /api/todos/:id — should return one todo', async () => {
    const res = await request(app.getHttpServer()).get(`/api/todos/${createdId}`).expect(200);

    expect(res.body.data.title).toBe('E2E Test Todo');
  });

  it('PUT /api/todos/:id — should update a todo', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/todos/${createdId}`)
      .send({ completed: true })
      .expect(200);

    expect(res.body.data.completed).toBe(true);
  });

  it('DELETE /api/todos/:id — should delete a todo', async () => {
    await request(app.getHttpServer()).delete(`/api/todos/${createdId}`).expect(200);

    await request(app.getHttpServer()).get(`/api/todos/${createdId}`).expect(404);
  });

  it('POST /api/todos — should reject empty title', async () => {
    await request(app.getHttpServer()).post('/api/todos').send({ title: '' }).expect(400);
  });
});
