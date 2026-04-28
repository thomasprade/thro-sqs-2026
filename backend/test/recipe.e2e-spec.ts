import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { IngredientEntity } from '../src/ingredients/ingredient.entity';
import { IngredientsModule } from '../src/ingredients/ingredients.module';
import { RecipeEntity } from '../src/recipes/recipe.entity';
import { RecipeModule } from '../src/recipes/recipe.module';

describe('Todo (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [RecipeEntity, IngredientEntity],
          synchronize: true,
        }),
        RecipeModule,
        IngredientsModule,
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

  it('POST /api/recipes — should create a todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'E2E Test Recipe',
        description: 'E2E Test Description',
        author: 'E2E Test Author',
      })
      .expect(201);

    expect(res.body.data.title).toBe('E2E Test Recipe');
    expect(res.body.data.description).toBe('E2E Test Description');
    expect(res.body.data.author).toBe('E2E Test Author');
    expect(res.body.data.id).toBeDefined();
    createdId = res.body.data.id;
  });

  it('GET /api/recipes — should return all todos', async () => {
    const res = await request(app.getHttpServer()).get('/api/recipes').expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('E2E Test Recipe');
    expect(res.body.data[0].description).toBe('E2E Test Description');
    expect(res.body.data[0].author).toBe('E2E Test Author');
    expect(res.body.data[0].id).toBeDefined();
  });

  it('GET /api/recipes/:id — should return one recipe', async () => {
    const res = await request(app.getHttpServer()).get(`/api/recipes/${createdId}`).expect(200);

    expect(res.body.data.title).toBe('E2E Test Recipe');
    expect(res.body.data.description).toBe('E2E Test Description');
    expect(res.body.data.author).toBe('E2E Test Author');
    expect(res.body.data.id).toBeDefined();
  });

  it('PUT /api/recipes/:id — should update a recipe', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/recipes/${createdId}`)
      .send({
        title: 'E2E Test updated Recipe',
        description: 'E2E Test updated Description',
        author: 'E2E Test updated Author',
      })
      .expect(200);

    expect(res.body.data.title).toBe('E2E Test updated Recipe');
    expect(res.body.data.description).toBe('E2E Test updated Description');
    expect(res.body.data.author).toBe('E2E Test updated Author');
  });

  it('DELETE /api/recipes/:id — should delete a recipe', async () => {
    await request(app.getHttpServer()).delete(`/api/recipes/${createdId}`).expect(200);

    await request(app.getHttpServer()).get(`/api/recipes/${createdId}`).expect(404);
  });

  it('POST /api/recipes — should reject empty title', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: '',
        description: 'E2E Test Description',
        author: 'E2E Test Author',
      })
      .expect(400);
  });

  it('POST /api/recipes — should reject empty description', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'E2E Test Title',
        description: '',
        author: 'E2E Test Author',
      })
      .expect(400);
  });
  it('POST /api/recipes — should reject empty author', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'E2E Test Title',
        description: 'E2E Test Description',
        author: '',
      })
      .expect(400);
  });
});
