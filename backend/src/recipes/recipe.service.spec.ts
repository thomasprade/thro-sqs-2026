import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let repo: jest.Mocked<Repository<RecipeEntity>>;

  const mockRecipe: RecipeEntity = {
    id: 1,
    title: 'Test recipe',
    description: 'Boil some eggs',
    author: 'John',
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
            create: jest.fn().mockResolvedValue(mockRecipe),
            save: jest.fn().mockResolvedValue(mockRecipe),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(RecipeService);
    repo = module.get(getRepositoryToken(RecipeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all recipes', async () => {
      const result = await service.findAll();
      // MAYBE: isn't this better than the test in recipe.controller.spec.ts?
      expect(result).toEqual([mockRecipe]);
      expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
    });
  });

  describe('findOne', () => {
    it('should return a recipe by it', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockRecipe);
    });

    // TODO: check if there are any other errors to be checked for
    // TODO: above also for controller
    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
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
      expect(repo.create).toHaveBeenCalledWith({
        title: 'Test recipe',
        description: 'Add Salt',
        author: 'Bob',
      });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the recipe', async () => {
      // TODO: what do these `...` do..?
      const updated = { ...mockRecipe, title: 'Updated' };
      repo.save.mockResolvedValue(updated);
      const result = await service.update(1, { title: 'Updated', author: 'Jason' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockRecipe);
    });
  });
});
