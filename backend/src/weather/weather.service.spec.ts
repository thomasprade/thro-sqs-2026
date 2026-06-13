import { Test, TestingModule } from '@nestjs/testing';
import { WeatherRepository } from './weather.repository';
import { WeatherService } from './weather.service';

describe(WeatherService.name, () => {
  let service: WeatherService;
  let weatherRepository: jest.Mocked<WeatherRepository>;

  const mockWeatherResponse = {
    latitude: 0,
    longitude: 0,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    timezone_abbreviation: 'UTC',
    elevation: 0,
    current_units: {
      time: 'iso8601',
      interval: 'hourly',
      temperature_2m: '°C',
      weather_code: 'wmo code',
    },
    current: {
      temperature_2m: 20,
      weather_code: 1,
      time: '2026-01-01T00:00:00Z',
      interval: 60,
    },
  };

  const expectedWeather = {
    temperature: 20,
    weatherCode: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherRepository,
          useValue: {
            getWeather: jest.fn().mockResolvedValue(mockWeatherResponse),
          },
        },
      ],
    }).compile();

    service = module.get(WeatherService);
    weatherRepository = module.get(WeatherRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return the weather', async () => {
      const result = await service.getWeather();
      expect(result).toEqual(expectedWeather);
      expect(weatherRepository.getWeather).toHaveBeenCalled();
    });
  });
});
