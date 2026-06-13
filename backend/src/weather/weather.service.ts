import { Weather } from '@app/shared';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MeteoApiResponse, WeatherRepository } from './weather.repository';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherRepository: WeatherRepository) {}

  async getWeather(): Promise<Weather> {
    const weather = await this.weatherRepository.getWeather();
    if (!weather) {
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
    return this.mapToWeather(weather);
  }

  private mapToWeather(data: MeteoApiResponse): Weather {
    return {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
    };
  }
}
