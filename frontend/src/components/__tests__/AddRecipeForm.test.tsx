import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AddRecipeForm from '../AddRecipeForm';

describe('AddRecipeForm', () => {
  it('renders title, description, and author fields', () => {
    render(<AddRecipeForm onAdd={vi.fn()} />);
    expect(screen.getByLabelText('Recipe title')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipe description')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipe author')).toBeInTheDocument();
  });

  it('submit button is disabled when title is empty', () => {
    render(<AddRecipeForm onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add recipe/i })).toBeDisabled();
  });

  it('calls onAdd with correct values on submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddRecipeForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText('Recipe title'), 'Pasta');
    await user.type(screen.getByLabelText('Recipe description'), 'A simple dish');
    await user.type(screen.getByLabelText('Recipe author'), 'Alice');
    await user.click(screen.getByRole('button', { name: /add recipe/i }));

    expect(onAdd).toHaveBeenCalledWith({
      title: 'Pasta',
      description: 'A simple dish',
      author: 'Alice',
    });
  });

  it('clears all fields after successful submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddRecipeForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText('Recipe title'), 'Pasta');
    await user.type(screen.getByLabelText('Recipe description'), 'A simple dish');
    await user.click(screen.getByRole('button', { name: /add recipe/i }));

    expect(screen.getByLabelText('Recipe title')).toHaveValue('');
    expect(screen.getByLabelText('Recipe description')).toHaveValue('');
  });

  it('disables fields and button while submitting', async () => {
    const user = userEvent.setup();
    let resolve: () => void;
    const onAdd = vi.fn().mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      }),
    );
    render(<AddRecipeForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText('Recipe title'), 'Pasta');
    await user.click(screen.getByRole('button', { name: /add recipe/i }));

    await screen.findByRole('button', { name: /adding/i });
    expect(screen.getByLabelText('Recipe title')).toBeDisabled();
    resolve!();
  });
});
