import { HttpService } from '@nestjs/axios';
import { MeteoApiResponse, WeatherRepository } from './weather.repository';

describe(WeatherRepository.name, () => {
  let repository: WeatherRepository;
  let httpService: jest.Mocked<HttpService>;

  const mockMeteoApiResponse: MeteoApiResponse = {
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

  beforeEach(async () => {
    httpService = {
      axiosRef: {
        get: jest.fn().mockResolvedValue({ data: mockMeteoApiResponse }),
      },
    } as unknown as jest.Mocked<HttpService>;

    repository = new WeatherRepository(httpService);
    repository.onModuleInit();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data', async () => {
      const result = await repository.getWeather();
      expect(result).toEqual(mockMeteoApiResponse);
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast?latitude=47.8564&longitude=12.1225&current=temperature_2m%2Cweather_code&timezone=auto&forecast_days=1',
      );
    });

    it('should return null on API failure', async () => {
      (httpService.axiosRef.get as jest.Mock).mockRejectedValue(new Error('API error'));
      const result = await repository.getWeather();
      expect(result).toBeNull();
    });
  });
});
