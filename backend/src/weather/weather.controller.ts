import { ApiResponse, Weather } from '@app/shared';
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @Public()
  async getWeather(): Promise<ApiResponse<Weather>> {
    const weather = await this.weatherService.getWeather();
    return { data: weather };
  }
}
