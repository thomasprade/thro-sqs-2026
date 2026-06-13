import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class WeatherRepository implements OnModuleInit {
  private readonly logger = new Logger(WeatherRepository.name);
  private circuitBreaker!: CircuitBreaker;

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.circuitBreaker = new CircuitBreaker((url: string) => this.httpService.axiosRef.get(url), {
      timeout: 7000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });

    this.circuitBreaker.on('open', () =>
      this.logger.warn('Circuit breaker opened - weather API is unavailable'),
    );
    this.circuitBreaker.on('halfOpen', () =>
      this.logger.warn('Circuit breaker half-open - testing weather API'),
    );
    this.circuitBreaker.on('close', () =>
      this.logger.warn('Circuit breaker closed - weather API is available'),
    );

    this.circuitBreaker.fallback(() => {
      this.logger.error('Weather API request failed');
      return { data: null };
    });
  }

  async getWeather(): Promise<MeteoApiResponse | null> {
    const response = (await this.circuitBreaker.fire(this.buildUrl())) as {
      data: MeteoApiResponse | null;
    };
    return response.data;
  }

  private buildUrl(): string {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', '47.8564');
    url.searchParams.append('longitude', '12.1225');
    url.searchParams.append('current', 'temperature_2m,weather_code');
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '1');
    return url.toString();
  }
}

export interface MeteoApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    weather_code: string;
  };
  current: {
    temperature_2m: number;
    weather_code: number;
    time: string;
    interval: number;
  };
}
