import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UserEntity } from '../src/auth/user.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [UserEntity],
          synchronize: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Seed a test user
    const repo = dataSource.getRepository(UserEntity);
    const passwordHash = await bcrypt.hash('testpassword', 10);
    await repo.save({ username: 'testuser', passwordHash });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return access_token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should return 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'nobody', password: 'password' })
        .expect(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 without a token', async () => {
      await request(app.getHttpServer()).get('/api/auth/profile').expect(401);
    });

    it('should return user payload with a valid token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .expect(200);

      const token = loginResponse.body.access_token;

      const profileResponse = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body).toMatchObject({
        sub: expect.any(Number),
        username: 'testuser',
      });
    });

    it('should return 401 with an invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
