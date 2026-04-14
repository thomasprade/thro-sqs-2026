import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: jest.Mocked<RecipeService>;

  const mockRecipe: RecipeEntity = {
    id: 1,
    title: 'Test recipe',
    description: 'Boil some eggs',
    author: 'John',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ingredients: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockRecipe]),
            findOne: jest.fn().mockResolvedValue(mockRecipe),
            create: jest.fn().mockResolvedValue(mockRecipe),
            update: jest.fn().mockResolvedValue(mockRecipe),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get(RecipeController);
    service = module.get(RecipeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const result = await controller.findAll();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test recipe');
    });
  });

  describe('create', () => {
    it('should create a recipe', async () => {
      const result = await controller.create({
        title: 'Test recipe',
        description: 'More Salt',
        author: 'Justin',
      });
      expect(result.data.title).toBe('Test recipe');
      expect(service.create).toHaveBeenCalledWith({
        title: 'Test recipe',
        description: 'More Salt',
        author: 'Justin',
      });
    });
  });

  describe('remove', () => {
    it('should remove a recipe', async () => {
      const result = await controller.remove(1);
      expect(result.message).toContain('deleted');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
