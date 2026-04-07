import type { Todo } from '@app/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TodoList from '../TodoList';

const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'First todo',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Second todo',
    completed: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
];

describe('TodoList', () => {
  it('renders empty state when no todos', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders a list of todos', () => {
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('shows completed todos with line-through', () => {
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const completedSpan = screen.getByText('Second todo');
    expect(completedSpan).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={onToggle} onDelete={vi.fn()} />);
    const checkbox = screen.getByLabelText('Toggle First todo');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(1, false);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={onDelete} />);
    const deleteBtn = screen.getByLabelText('Delete First todo');
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
