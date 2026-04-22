import type { Recipe } from '@app/shared';
import { fireEvent, render, screen } from '@testing-library/react';
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
    render(<RecipeList recipes={[]} onDelete={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders a list of recipes', () => {
    render(<RecipeList recipes={mockRecipes} onDelete={vi.fn()} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });

  it('renders author and description when present', () => {
    render(<RecipeList recipes={mockRecipes} onDelete={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Simple pasta dish')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<RecipeList recipes={mockRecipes} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Delete Pasta'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
