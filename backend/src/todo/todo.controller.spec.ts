import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let service: jest.Mocked<TodoService>;

  const mockTodo: TodoEntity = {
    id: 1,
    title: 'Test todo',
    completed: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockTodo]),
            findOne: jest.fn().mockResolvedValue(mockTodo),
            create: jest.fn().mockResolvedValue(mockTodo),
            update: jest.fn().mockResolvedValue(mockTodo),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get(TodoController);
    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = await controller.findAll();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test todo');
    });
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const result = await controller.create({ title: 'Test todo' });
      expect(result.data.title).toBe('Test todo');
      expect(service.create).toHaveBeenCalledWith({ title: 'Test todo' });
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const result = await controller.remove(1);
      expect(result.message).toContain('deleted');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
