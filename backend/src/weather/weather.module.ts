import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherRepository } from './weather.repository';
import { WeatherService } from './weather.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherRepository],
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
})
export class WeatherModule {}
