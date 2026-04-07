import type { Todo } from '@app/shared';
import { useCallback, useEffect, useState } from 'react';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAdd = async (title: string) => {
    const todo = await createTodo({ title });
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const updated = await updateTodo(id, { completed: !completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Todo App</h1>
      <AddTodoForm onAdd={handleAdd} />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}
