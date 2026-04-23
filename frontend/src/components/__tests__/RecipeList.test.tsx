import type { Recipe } from '@app/shared';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RecipeList from '../RecipeList';

const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Pasta',
    description: 'Simple pasta dish',
    author: 'Alice',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Salad',
    description: '',
    author: '',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
];

describe('RecipeList', () => {
  it('renders empty state when no recipes', () => {
    render(<RecipeList recipes={[]} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders a list of recipes', () => {
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('renders author and description when present', () => {
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Simple pasta dish')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Delete Pasta'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('update button opens form for that recipe only', async () => {
    const user = userEvent.setup();
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );

    expect(
      within(screen.getByTestId('recipe-1')).getByLabelText('Update recipe title'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('recipe-2')).queryByLabelText('Update recipe title'),
    ).not.toBeInTheDocument();
  });

  it('update button label toggles to cancel', async () => {
    const user = userEvent.setup();
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );

    expect(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Cancel' }),
    ).toBeInTheDocument();
  });

  it('cancel button closes the form', async () => {
    const user = userEvent.setup();
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );
    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Cancel' }),
    );

    expect(
      within(screen.getByTestId('recipe-1')).queryByLabelText('Update recipe title'),
    ).not.toBeInTheDocument();
  });

  it('only one form open at a time', async () => {
    const user = userEvent.setup();
    render(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );
    await user.click(
      within(screen.getByTestId('recipe-2')).getByRole('button', { name: 'Update' }),
    );

    expect(
      within(screen.getByTestId('recipe-1')).queryByLabelText('Update recipe title'),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId('recipe-2')).getByLabelText('Update recipe title'),
    ).toBeInTheDocument();
  });

  it('calls onUpdate with correct id and dto', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<RecipeList recipes={mockRecipes} onUpdate={onUpdate} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );

    const titleInput = within(screen.getByTestId('recipe-1')).getByLabelText('Update recipe title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Pasta');
    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update Recipe' }),
    );

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'New Pasta',
      description: 'Simple pasta dish',
      author: 'Alice',
    });
  });

  it('form closes after successful update', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<RecipeList recipes={mockRecipes} onUpdate={onUpdate} onDelete={vi.fn()} />);

    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update' }),
    );
    await user.click(
      within(screen.getByTestId('recipe-1')).getByRole('button', { name: 'Update Recipe' }),
    );

    expect(
      within(screen.getByTestId('recipe-1')).queryByLabelText('Update recipe title'),
    ).not.toBeInTheDocument();
  });
});
