import type { CreateTodoDto, Todo, UpdateTodoDto } from '@app/shared';
import type { Page } from '@playwright/test';

function createTodo(id: number, title: string): Todo {
  const timestamp = new Date().toISOString();
  return {
    id,
    title,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function installTodoApiMock(page: Page): Promise<void> {
  const todos: Todo[] = [];
  let nextId = 1;

  await page.route('**/api/todos**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());
    const collectionMatch = pathname === '/api/todos';
    const todoIdMatch = /^\/api\/todos\/(\d+)$/.exec(pathname);

    if (request.method() === 'GET' && collectionMatch) {
      await route.fulfill({ json: { data: todos } });
      return;
    }

    if (request.method() === 'POST' && collectionMatch) {
      const { title } = request.postDataJSON() as CreateTodoDto;
      const todo = createTodo(nextId++, title);
      todos.unshift(todo);
      await route.fulfill({ json: { data: todo } });
      return;
    }

    if (request.method() === 'PUT' && todoIdMatch) {
      const id = Number(todoIdMatch[1]);
      const todo = todos.find((item) => item.id === id);
      if (!todo) {
        await route.fulfill({ status: 404, json: { message: 'Todo not found' } });
        return;
      }

      const updates = request.postDataJSON() as UpdateTodoDto;
      const timestamp = new Date().toISOString();
      Object.assign(todo, updates, { updatedAt: timestamp });
      await route.fulfill({ json: { data: todo } });
      return;
    }

    if (request.method() === 'DELETE' && todoIdMatch) {
      const id = Number(todoIdMatch[1]);
      const index = todos.findIndex((item) => item.id === id);
      if (index === -1) {
        await route.fulfill({ status: 404, json: { message: 'Todo not found' } });
        return;
      }

      todos.splice(index, 1);
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
  });
}
