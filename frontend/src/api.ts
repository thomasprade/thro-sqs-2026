import type { ApiResponse, CreateTodoDto, Todo, UpdateTodoDto } from '@app/shared';

const API_BASE = '/api/todos';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch todos');
  const body = (await res.json()) as ApiResponse<Todo[]>;
  return body.data;
}

export async function createTodo(dto: CreateTodoDto): Promise<Todo> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  const body = (await res.json()) as ApiResponse<Todo>;
  return body.data;
}

export async function updateTodo(id: number, dto: UpdateTodoDto): Promise<Todo> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  const body = (await res.json()) as ApiResponse<Todo>;
  return body.data;
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
}
