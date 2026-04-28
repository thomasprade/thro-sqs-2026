import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../recipes/recipe.entity';
import { IngredientEntity } from './ingredient.entity';
import { IngredientsService } from './ingredients.service';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let recipeRepo: jest.Mocked<Repository<RecipeEntity>>;
  let ingredientRepo: jest.Mocked<Repository<IngredientEntity>>;

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
      providers: [
        IngredientsService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockRecipe),
          },
        },
        {
          provide: getRepositoryToken(IngredientEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockIngredient]),
            findOneBy: jest.fn().mockResolvedValue(mockIngredient),
            create: jest.fn().mockReturnValue([mockIngredient]),
            save: jest.fn().mockResolvedValue(mockIngredient),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(IngredientsService);
    recipeRepo = module.get(getRepositoryToken(RecipeEntity));
    ingredientRepo = module.get(getRepositoryToken(IngredientEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIngredients', () => {
    it('should return ingredients for an existing recipe', async () => {
      const result = await service.getIngredients(1);
      expect(result).toEqual([mockIngredient]);
      expect(ingredientRepo.find).toHaveBeenCalledWith({
        where: { recipeId: 1 },
        order: { id: 'ASC' },
      });
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      recipeRepo.findOneBy.mockResolvedValue(null);
      await expect(service.getIngredients(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addIngredients', () => {
    it('should add new ingredients and return the full list', async () => {
      const dtoList = [
        { name: 'Milk', amount: 0.5, unit: 'Liters' },
        { name: 'Eggs', amount: 1, unit: 'pieces' },
      ];

      const result = await service.addIngredients(1, dtoList);

      expect(ingredientRepo.create).toHaveBeenCalledWith([
        { recipeId: 1, name: 'Milk', amount: 0.5, unit: 'Liters' },
        { recipeId: 1, name: 'Eggs', amount: 1, unit: 'pieces' },
      ]);
      expect(ingredientRepo.save).toHaveBeenCalled();
      expect(ingredientRepo.find).toHaveBeenCalledWith({
        where: { recipeId: 1 },
        order: { id: 'ASC' },
      });
      expect(result).toEqual([mockIngredient]);
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      recipeRepo.findOneBy.mockResolvedValue(null);
      await expect(service.addIngredients(99, [])).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateIngredient', () => {
    it('should update the ingredient fields and return the saved entity', async () => {
      const dto = { name: 'Updated Milk', amount: 1, unit: 'L' };
      const result = await service.updateIngredient(1, dto);

      expect(ingredientRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ingredientRepo.save).toHaveBeenCalledWith({ ...mockIngredient, ...dto });
      expect(result).toEqual(mockIngredient);
    });

    it('should throw NotFoundException if ingredient does not exist', async () => {
      ingredientRepo.findOneBy.mockResolvedValue(null);
      await expect(service.updateIngredient(99, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeIngredient', () => {
    it('should remove the ingredient', async () => {
      await service.removeIngredient(1);

      expect(ingredientRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ingredientRepo.remove).toHaveBeenCalledWith(mockIngredient);
    });

    it('should throw NotFoundException if ingredient does not exist', async () => {
      ingredientRepo.findOneBy.mockResolvedValue(null);
      await expect(service.removeIngredient(99)).rejects.toThrow(NotFoundException);
    });
  });
});
