import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    return this.todoRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  async create(dto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepo.create(dto);
    return this.todoRepo.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.findOne(id);
    const changes = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined));
    Object.assign(todo, changes);
    return this.todoRepo.save(todo);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepo.remove(todo);
  }
}
