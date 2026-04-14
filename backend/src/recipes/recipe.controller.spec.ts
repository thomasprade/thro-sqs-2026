import { Test, TestingModule } from '@nestjs/testing';
import { IngredientEntity } from './ingredient.entity';
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

  const mockIngredient: IngredientEntity = {
    id: 1,
    recipeId: 1,
    recipe: {} as RecipeEntity,
    name: 'Milk',
    amount: 0.5,
    unit: 'Liters',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
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
            getIngredients: jest.fn().mockResolvedValue([mockIngredient]),
            addIngredients: jest.fn().mockResolvedValue([mockIngredient]),
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

  describe('getIngredients', () => {
    it('should return ingredients for a recipe', async () => {
      const result = await controller.getIngredients(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Milk');
      expect(service.getIngredients).toHaveBeenCalledWith(1);
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients and return the updated list', async () => {
      const payload = [
        { name: 'Milk', amount: 0.5, unit: 'Liters' },
        { name: 'Eggs', amount: 1, unit: 'pieces' },
      ];

      const result = await controller.addIngredients(1, payload);

      expect(result.data).toHaveLength(1);
      expect(service.addIngredients).toHaveBeenCalledWith(1, payload);
    });
  });
});
