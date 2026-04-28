import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { IngredientEntity } from '../src/ingredients/ingredient.entity';
import { IngredientsModule } from '../src/ingredients/ingredients.module';
import { RecipeEntity } from '../src/recipes/recipe.entity';
import { RecipeModule } from '../src/recipes/recipe.module';

describe('Ingredients (e2e)', () => {
  let app: INestApplication;
  let recipeId: number;
  let ingredientId: number;

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

    const res = await request(app.getHttpServer())
      .post('/api/recipes')
      .send({
        title: 'Ingredients Recipe',
        description: 'Recipe used for ingredients tests',
        author: 'E2E Author',
      })
      .expect(201);

    recipeId = res.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/recipes/:id/ingredients — should add multiple ingredients', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/recipes/${recipeId}/ingredients`)
      .send([
        { name: 'Milk', amount: 0.5, unit: 'Liters' },
        { name: 'Eggs', amount: 1, unit: 'pieces' },
      ])
      .expect(201);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].name).toBe('Milk');
    expect(res.body.data[1].name).toBe('Eggs');
    ingredientId = res.body.data[0].id;
  });

  it('POST /api/recipes/:id/ingredients — should append and not overwrite existing ingredients', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/recipes/${recipeId}/ingredients`)
      .send([{ name: 'Flour', amount: 200, unit: 'g' }])
      .expect(201);

    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].name).toBe('Milk');
    expect(res.body.data[1].name).toBe('Eggs');
    expect(res.body.data[2].name).toBe('Flour');
  });

  it('GET /api/recipes/:id/ingredients — should return all ingredients for recipe', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/recipes/${recipeId}/ingredients`)
      .expect(200);

    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].name).toBe('Milk');
    expect(res.body.data[1].name).toBe('Eggs');
    expect(res.body.data[2].name).toBe('Flour');
  });

  it('GET /api/recipes/:id/ingredients — should return 404 for missing recipe', async () => {
    await request(app.getHttpServer()).get('/api/recipes/99999/ingredients').expect(404);
  });

  it('POST /api/recipes/:id/ingredients — should return 404 for missing recipe', async () => {
    await request(app.getHttpServer())
      .post('/api/recipes/99999/ingredients')
      .send([{ name: 'Sugar', amount: 1, unit: 'kg' }])
      .expect(404);
  });

  it('POST /api/recipes/:id/ingredients — should reject invalid payload items', async () => {
    await request(app.getHttpServer())
      .post(`/api/recipes/${recipeId}/ingredients`)
      .send([{ name: 'Salt', amount: 'invalid', unit: 'g' }])
      .expect(400);
  });

  it('PUT /api/recipes/:id/ingredients/:ingredientId — should update an ingredient', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/recipes/${recipeId}/ingredients/${ingredientId}`)
      .send({ name: 'Updated Milk', amount: 1, unit: 'L' })
      .expect(200);

    expect(res.body.data.name).toBe('Updated Milk');
    expect(res.body.data.amount).toBe(1);
    expect(res.body.data.unit).toBe('L');
  });

  it('PUT /api/recipes/:id/ingredients/:ingredientId — should return 404 for missing ingredient', async () => {
    await request(app.getHttpServer())
      .put(`/api/recipes/${recipeId}/ingredients/99999`)
      .send({ name: 'Ghost' })
      .expect(404);
  });

  it('DELETE /api/recipes/:id/ingredients/:ingredientId — should delete an ingredient', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/recipes/${recipeId}/ingredients/${ingredientId}`)
      .expect(200);

    expect(res.body.message).toContain('deleted');
  });

  it('DELETE /api/recipes/:id/ingredients/:ingredientId — should return 404 after already deleted', async () => {
    await request(app.getHttpServer())
      .delete(`/api/recipes/${recipeId}/ingredients/${ingredientId}`)
      .expect(404);
  });
});
