import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientEntity } from './ingredient.entity';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
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
        RecipeService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockRecipe]),
            findOneBy: jest.fn().mockResolvedValue(mockRecipe),
            create: jest.fn().mockReturnValue(mockRecipe),
            save: jest.fn().mockResolvedValue(mockRecipe),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(IngredientEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockIngredient]),
            create: jest.fn().mockReturnValue([mockIngredient]),
            save: jest.fn().mockResolvedValue([mockIngredient]),
          },
        },
      ],
    }).compile();

    service = module.get(RecipeService);
    recipeRepo = module.get(getRepositoryToken(RecipeEntity));
    ingredientRepo = module.get(getRepositoryToken(IngredientEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all recipes', async () => {
      const result = await service.findAll();
      // MAYBE: isn't this better than the test in recipe.controller.spec.ts?
      expect(result).toEqual([mockRecipe]);
      expect(recipeRepo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
    });
  });

  describe('findOne', () => {
    it('should return a recipe by it', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockRecipe);
    });

    it('should throw NotFoundException if not found', async () => {
      recipeRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a recipe', async () => {
      const result = await service.create({
        title: 'Test recipe',
        description: 'Add Salt',
        author: 'Bob',
      });
      expect(result).toEqual(mockRecipe);
      expect(recipeRepo.create).toHaveBeenCalledWith({
        title: 'Test recipe',
        description: 'Add Salt',
        author: 'Bob',
      });
      expect(recipeRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the recipe', async () => {
      const updated = { ...mockRecipe, title: 'Updated' };
      recipeRepo.save.mockResolvedValue(updated);
      const result = await service.update(1, { title: 'Updated', author: 'Jason' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      await service.remove(1);
      expect(recipeRepo.remove).toHaveBeenCalledWith(mockRecipe);
    });
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
  });
});
