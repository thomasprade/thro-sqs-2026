import type { ApiResponse, Todo } from '@app/shared';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

function toTodo(entity: TodoEntity): Todo {
  return {
    id: entity.id,
    title: entity.title,
    completed: entity.completed,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Controller('api/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Todo[]>> {
    const todos = await this.todoService.findAll();
    return { data: todos.map(toTodo) };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Todo>> {
    const todo = await this.todoService.findOne(id);
    return { data: toTodo(todo) };
  }

  @Post()
  async create(@Body() dto: CreateTodoDto): Promise<ApiResponse<Todo>> {
    const todo = await this.todoService.create(dto);
    return { data: toTodo(todo) };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<ApiResponse<Todo>> {
    const todo = await this.todoService.update(id, dto);
    return { data: toTodo(todo) };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.todoService.remove(id);
    return { message: `Todo #${id} deleted` };
  }
}
