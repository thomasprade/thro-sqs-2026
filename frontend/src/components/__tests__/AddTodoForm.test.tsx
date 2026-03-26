import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AddTodoForm from '../AddTodoForm';

describe('AddTodoForm', () => {
  it('renders an input and submit button', () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByLabelText('New todo title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('calls onAdd with trimmed title on submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodoForm onAdd={onAdd} />);

    const input = screen.getByLabelText('New todo title');
    await user.type(input, '  New todo  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after successful submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodoForm onAdd={onAdd} />);

    const input = screen.getByLabelText('New todo title');
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input).toHaveValue('');
  });
});
