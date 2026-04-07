import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let repo: jest.Mocked<Repository<TodoEntity>>;

  const mockTodo: TodoEntity = {
    id: 1,
    title: 'Test todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockTodo]),
            findOneBy: jest.fn().mockResolvedValue(mockTodo),
            create: jest.fn().mockReturnValue(mockTodo),
            save: jest.fn().mockResolvedValue(mockTodo),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(TodoService);
    repo = module.get(getRepositoryToken(TodoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockTodo]);
      expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const result = await service.create({ title: 'Test todo' });
      expect(result).toEqual(mockTodo);
      expect(repo.create).toHaveBeenCalledWith({ title: 'Test todo' });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the todo', async () => {
      const updated = { ...mockTodo, title: 'Updated' };
      repo.save.mockResolvedValue(updated);
      const result = await service.update(1, { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockTodo);
    });
  });
});
