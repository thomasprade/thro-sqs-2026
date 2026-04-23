import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UpdateRecipeForm from '../UpdateRecipeForm';
import type { Recipe } from '@app/shared';

const mockRecipe: Recipe = {
  id: 1,
  title: 'Pasta',
  description: 'Simple pasta dish',
  author: 'Alice',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('UpdateRecipeForm', () => {
  it('renders all three fields', () => {
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={vi.fn()} />);
    expect(screen.getByLabelText('Update recipe title')).toBeInTheDocument();
    expect(screen.getByLabelText('Update recipe description')).toBeInTheDocument();
    expect(screen.getByLabelText('Update recipe author')).toBeInTheDocument();
  });

  it('fields are pre-filled with recipe values', () => {
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={vi.fn()} />);
    expect(screen.getByLabelText('Update recipe title')).toHaveValue('Pasta');
    expect(screen.getByLabelText('Update recipe description')).toHaveValue('Simple pasta dish');
    expect(screen.getByLabelText('Update recipe author')).toHaveValue('Alice');
  });

  it('submit button is disabled when title is cleared', async () => {
    const user = userEvent.setup();
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={vi.fn()} />);
    await user.clear(screen.getByLabelText('Update recipe title'));
    expect(screen.getByRole('button', { name: /update recipe/i })).toBeDisabled();
  });

  it('calls onUpdate with correct id and dto', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={onUpdate} />);

    const titleInput = screen.getByLabelText('Update recipe title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Pasta');
    await user.click(screen.getByRole('button', { name: /update recipe/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'New Pasta',
      description: 'Simple pasta dish',
      author: 'Alice',
    });
  });

  it('empty optional fields become undefined in the dto', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={onUpdate} />);

    await user.clear(screen.getByLabelText('Update recipe description'));
    await user.clear(screen.getByLabelText('Update recipe author'));
    await user.click(screen.getByRole('button', { name: /update recipe/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'Pasta',
      description: undefined,
      author: undefined,
    });
  });

  it('disables fields and button while submitting', async () => {
    const user = userEvent.setup();
    let resolve: () => void;
    const onUpdate = vi.fn().mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      }),
    );
    render(<UpdateRecipeForm recipe={mockRecipe} onUpdate={onUpdate} />);

    user.click(screen.getByRole('button', { name: /update recipe/i }));

    await screen.findByRole('button', { name: /updating/i });
    expect(screen.getByLabelText('Update recipe title')).toBeDisabled();
    resolve!();
  });
});
