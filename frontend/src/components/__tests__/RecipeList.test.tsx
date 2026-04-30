import type { Recipe } from '@app/shared';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RecipeList from '../RecipeList';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

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
    description: 'Fresh garden salad',
    author: '',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RecipeList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders empty state when no recipes', () => {
    renderWithRouter(<RecipeList recipes={[]} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders a table with recipes', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
    expect(screen.getByText('Simple pasta dish')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Recipe Name')).toBeInTheDocument();
    expect(screen.getByText('Recipe Description')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText('Delete Pasta'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('delete button does not trigger navigation', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Delete Pasta'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to /demo when row is clicked', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('recipe-1'));
    expect(mockNavigate).toHaveBeenCalledWith('/demo');
  });

  it('edit button does not trigger navigation', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Edit Pasta'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('edit button opens form for that recipe only', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Edit Pasta'));
    expect(screen.getByLabelText('Update recipe title')).toBeInTheDocument();
  });

  it('clicking edit again closes the form', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Edit Pasta'));
    fireEvent.click(screen.getByLabelText('Edit Pasta'));
    expect(screen.queryByLabelText('Update recipe title')).not.toBeInTheDocument();
  });

  it('calls onUpdate with correct id and dto', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={onUpdate} onDelete={vi.fn()} />);

    await user.click(screen.getByLabelText('Edit Pasta'));

    const titleInput = screen.getByLabelText('Update recipe title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Pasta');
    await user.click(screen.getByRole('button', { name: 'Update Recipe' }));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'New Pasta',
      description: 'Simple pasta dish',
      author: 'Alice',
    });
  });

  it('form closes after successful update', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={onUpdate} onDelete={vi.fn()} />);

    await user.click(screen.getByLabelText('Edit Pasta'));
    await user.click(screen.getByRole('button', { name: 'Update Recipe' }));

    expect(screen.queryByLabelText('Update recipe title')).not.toBeInTheDocument();
  });

  describe('search', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders a search field', () => {
      renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });

    it('filters recipes by title after debounce', () => {
      renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'pasta' } });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.queryByText('Salad')).not.toBeInTheDocument();
    });

    it('filters recipes by description after debounce', () => {
      renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'garden' } });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.queryByText('Pasta')).not.toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });

    it('shows no matching message when search has no results', () => {
      renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'xyz' } });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByText('No matching recipes')).toBeInTheDocument();
    });

    it('does not filter before debounce delay', () => {
      renderWithRouter(<RecipeList recipes={mockRecipes} onUpdate={vi.fn()} onDelete={vi.fn()} />);

      fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'pasta' } });
      // Don't advance timers — both should still be visible
      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });
  });
});
