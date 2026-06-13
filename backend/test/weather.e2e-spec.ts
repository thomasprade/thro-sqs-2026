import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';
import request from 'supertest';
import { WeatherModule } from '../src/weather/weather.module';

const METEO_API_HOST = 'https://api.open-meteo.com';
const METEO_API_PATH = '/v1/forecast';

const mockMeteoApiResponse = {
  latitude: 47.8564,
  longitude: 12.1225,
  generationtime_ms: 0.1,
  utc_offset_seconds: 3600,
  timezone: 'Europe/Berlin',
  timezone_abbreviation: 'CET',
  elevation: 440,
  current_units: {
    time: 'iso8601',
    interval: 'seconds',
    temperature_2m: '°C',
    weather_code: 'wmo code',
  },
  current: {
    time: '2026-06-13T12:00',
    interval: 900,
    temperature_2m: 22.5,
    weather_code: 1,
  },
};

describe('Weather (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.enableNetConnect();
    await app.close();
  });

  describe('GET /api/weather', () => {
    it('should return weather data on success', async () => {
      nock(METEO_API_HOST).get(METEO_API_PATH).query(true).reply(200, mockMeteoApiResponse);

      const res = await request(app.getHttpServer()).get('/api/weather').expect(200);

      expect(res.body.data).toEqual({
        temperature: 22.5,
        weatherCode: 1,
      });
    });

    it('should return 500 when the external API fails', async () => {
      nock(METEO_API_HOST).get(METEO_API_PATH).query(true).replyWithError('API unavailable');

      await request(app.getHttpServer()).get('/api/weather').expect(500);
    });
  });
});
