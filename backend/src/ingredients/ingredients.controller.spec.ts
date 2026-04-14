import { Test, TestingModule } from '@nestjs/testing';
import { RecipeEntity } from '../recipes/recipe.entity';
import { IngredientEntity } from './ingredient.entity';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

describe('IngredientsController', () => {
  let controller: IngredientsController;
  let service: jest.Mocked<IngredientsService>;

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
      controllers: [IngredientsController],
      providers: [
        {
          provide: IngredientsService,
          useValue: {
            getIngredients: jest.fn().mockResolvedValue([mockIngredient]),
            addIngredients: jest.fn().mockResolvedValue([mockIngredient]),
          },
        },
      ],
    }).compile();

    controller = module.get(IngredientsController);
    service = module.get(IngredientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
