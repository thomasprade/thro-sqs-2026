import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe(WeatherController.name, () => {
  let controller: WeatherController;
  let service: jest.Mocked<WeatherService>;

  const mockWeather = {
    temperature: 20,
    weatherCode: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn().mockResolvedValue(mockWeather),
          },
        },
      ],
    }).compile();

    controller = module.get(WeatherController);
    service = module.get(WeatherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return the weather', async () => {
      const result = await controller.getWeather();
      expect(result).toEqual({ data: mockWeather });
      expect(service.getWeather).toHaveBeenCalled();
    });
  });
});
