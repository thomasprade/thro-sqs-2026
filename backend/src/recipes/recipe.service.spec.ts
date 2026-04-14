import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepo: jest.Mocked<Repository<RecipeEntity>>;

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
      ],
    }).compile();

    service = module.get(RecipeService);
    recipeRepo = module.get(getRepositoryToken(RecipeEntity));
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
});
