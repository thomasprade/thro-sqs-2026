import type { Todo } from '@app/shared';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: Readonly<TodoListProps>) {
  if (todos.length === 0) {
    return <p data-testid="empty-state">No todos yet. Add one above!</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          data-testid={`todo-${todo.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee',
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id, todo.completed)}
            aria-label={`Toggle ${todo.title}`}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#333',
            }}
          >
            {todo.title}
          </span>
          <button onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
