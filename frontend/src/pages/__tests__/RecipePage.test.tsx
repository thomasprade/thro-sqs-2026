import type { Ingredient, Recipe } from '@app/shared';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext';
import RecipePage from '../RecipePage';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../api', () => ({
  fetchRecipe: vi.fn(),
  fetchIngredients: vi.fn(),
  addIngredients: vi.fn(),
  updateIngredient: vi.fn(),
  deleteIngredient: vi.fn(),
  updateRecipe: vi.fn(),
  getWeather: vi.fn().mockResolvedValue({ temperature: 20, weatherCode: 0 }),
}));

import {
  addIngredients,
  deleteIngredient,
  fetchIngredients,
  fetchRecipe,
  updateIngredient,
  updateRecipe,
} from '../../api';
import { AUTH_TOKEN_KEY, TEST_TOKEN } from '../../components/__tests__/test.helper';

const mockRecipe: Recipe = {
  id: 1,
  title: 'Pasta Carbonara',
  description: 'A classic Italian pasta dish',
  author: 'Chef Mario',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    recipeId: 1,
    name: 'Spaghetti',
    amount: 200,
    unit: 'g',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    recipeId: 1,
    name: 'Eggs',
    amount: 3,
    unit: 'pcs',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    recipeId: 1,
    name: 'Parmesan',
    amount: 50,
    unit: 'g',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

function renderRecipePage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/recipe/1']}>
        <Routes>
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('RecipePage', () => {
  beforeEach(() => {
    vi.mocked(fetchRecipe).mockResolvedValue(mockRecipe);
    vi.mocked(fetchIngredients).mockResolvedValue(mockIngredients);

    mockNavigate.mockClear();
    localStorage.setItem(AUTH_TOKEN_KEY, TEST_TOKEN);
  });

  afterEach(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  });

  it('shows loading state initially', () => {
    vi.mocked(fetchRecipe).mockReturnValue(new Promise(() => {}));
    vi.mocked(fetchIngredients).mockReturnValue(new Promise(() => {}));
    renderRecipePage();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('shows error for invalid (non-numeric) recipe ID', async () => {
    vi.mocked(fetchRecipe).mockClear();
    vi.mocked(fetchIngredients).mockClear();

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/recipe/abc']}>
          <Routes>
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    expect(screen.getByText('Invalid recipe ID')).toBeInTheDocument();
    expect(fetchRecipe).not.toHaveBeenCalled();
    expect(fetchIngredients).not.toHaveBeenCalled();
  });

  it('renders recipe title and description', async () => {
    renderRecipePage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pasta Carbonara' })).toBeInTheDocument();
    });
    expect(screen.getByText('A classic Italian pasta dish')).toBeInTheDocument();
  });

  it('renders ingredients with name, amount and unit', async () => {
    renderRecipePage();
    await waitFor(() => {
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    });
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Eggs')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Parmesan')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getAllByText('g')).toHaveLength(2);
    expect(screen.getByText('pcs')).toBeInTheDocument();
  });

  it('has default portion size of 1', async () => {
    renderRecipePage();
    await waitFor(() => {
      expect(screen.getByTestId('portions-input')).toBeInTheDocument();
    });
    const input = screen.getByTestId('portions-input').querySelector('input');
    expect(input).toHaveValue(1);
  });

  it('multiplies ingredient amounts by portion size', async () => {
    renderRecipePage();
    await waitFor(() => {
      expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    });

    const input = screen.getByTestId('portions-input').querySelector('input')!;
    await act(async () => {
      fireEvent.change(input, { target: { value: '2' } });
    });

    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    vi.mocked(fetchRecipe).mockRejectedValue(new Error('Network error'));
    vi.mocked(fetchIngredients).mockRejectedValue(new Error('Network error'));
    renderRecipePage();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    expect(screen.getByText('Failed to load recipe')).toBeInTheDocument();
  });

  it('shows "No ingredients yet" when recipe has no ingredients', async () => {
    vi.mocked(fetchIngredients).mockResolvedValue([]);
    renderRecipePage();

    await waitFor(() => {
      expect(screen.getByTestId('no-ingredients')).toBeInTheDocument();
    });
    expect(screen.getByText('No ingredients yet')).toBeInTheDocument();
    expect(screen.queryByTestId('portions-input')).not.toBeInTheDocument();
  });

  it('renders a back button that navigates to home', async () => {
    renderRecipePage();
    await waitFor(() => {
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('edit mode', () => {
    it('shows "Edit Recipe" button that toggles to "Done"', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByTestId('edit-ingredients-toggle')).toBeInTheDocument();
      });
      expect(screen.getByTestId('edit-ingredients-toggle')).toHaveTextContent('Edit Recipe');

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByTestId('edit-ingredients-toggle')).toHaveTextContent('Done');
    });

    it('shows edit and delete buttons in edit mode', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      expect(screen.queryByLabelText('Edit Spaghetti')).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByLabelText('Edit Spaghetti')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete Spaghetti')).toBeInTheDocument();
    });

    it('hides portions field in edit mode', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByTestId('portions-input')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.queryByTestId('portions-input')).not.toBeInTheDocument();
    });

    it('shows raw amounts in edit mode (not multiplied)', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByTestId('portions-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('portions-input').querySelector('input')!;
      await act(async () => {
        fireEvent.change(input, { target: { value: '2' } });
      });
      expect(screen.getByText('400')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.queryByText('400')).not.toBeInTheDocument();
    });

    it('deletes an ingredient when delete button is clicked', async () => {
      vi.mocked(deleteIngredient).mockResolvedValue(undefined);
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      await act(async () => {
        fireEvent.click(screen.getByLabelText('Delete Spaghetti'));
      });

      expect(deleteIngredient).toHaveBeenCalledWith(1, 1);
      expect(screen.queryByText('Spaghetti')).not.toBeInTheDocument();
    });

    it('opens edit dialog when edit button is clicked', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByLabelText('Edit Spaghetti'));

      expect(screen.getByRole('heading', { name: 'Edit Recipe' })).toBeInTheDocument();
      expect(screen.getByTestId('ingredient-name-0').querySelector('input')).toHaveValue(
        'Spaghetti',
      );
    });

    it('updates an ingredient via the edit dialog', async () => {
      const updatedIngredient = { ...mockIngredients[0], name: 'Penne', amount: 300 };
      vi.mocked(updateIngredient).mockResolvedValue(updatedIngredient);
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByLabelText('Edit Spaghetti'));

      fireEvent.change(screen.getByTestId('ingredient-name-0').querySelector('input')!, {
        target: { value: 'Penne' },
      });
      fireEvent.change(screen.getByTestId('ingredient-amount-0').querySelector('input')!, {
        target: { value: '300' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      });

      expect(updateIngredient).toHaveBeenCalledWith(1, 1, {
        name: 'Penne',
        amount: 300,
        unit: 'g',
      });
      await waitFor(() => {
        expect(screen.getByText('Penne')).toBeInTheDocument();
      });
    });

    it('shows "Add Ingredients" button in edit mode', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('add-ingredients-button')).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByTestId('add-ingredients-button')).toBeInTheDocument();
    });

    it('adds ingredients via the add dialog', async () => {
      const newList = [
        ...mockIngredients,
        {
          id: 4,
          recipeId: 1,
          name: 'Butter',
          amount: 50,
          unit: 'g',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ];
      vi.mocked(addIngredients).mockResolvedValue(newList);
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Spaghetti')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByTestId('add-ingredients-button'));

      expect(screen.getByRole('heading', { name: 'Add Ingredients' })).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('ingredient-name-0').querySelector('input')!, {
        target: { value: 'Butter' },
      });
      fireEvent.change(screen.getByTestId('ingredient-amount-0').querySelector('input')!, {
        target: { value: '50' },
      });
      fireEvent.change(screen.getByTestId('ingredient-unit-0').querySelector('input')!, {
        target: { value: 'g' },
      });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      });

      expect(addIngredients).toHaveBeenCalledWith(1, [{ name: 'Butter', amount: 50, unit: 'g' }]);
      await waitFor(() => {
        expect(screen.getByText('Butter')).toBeInTheDocument();
      });
    });

    it('"Done" button exits edit mode and restores portions field', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByTestId('portions-input')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.queryByTestId('portions-input')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByTestId('portions-input')).toBeInTheDocument();
    });
  });

  describe('description', () => {
    it('renders description as plain text below ingredients when not editing', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      expect(screen.getByTestId('description-text')).toHaveTextContent(
        'A classic Italian pasta dish',
      );
      expect(screen.queryByTestId('description-field')).not.toBeInTheDocument();
    });

    it('description text is rendered after the ingredient list', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      const ingredientTable = screen.getByRole('table');
      const descriptionText = screen.getByTestId('description-text');
      expect(
        ingredientTable.compareDocumentPosition(descriptionText) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('renders description as TextField when in edit mode', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByTestId('description-field')).toBeInTheDocument();
      expect(screen.queryByTestId('description-text')).not.toBeInTheDocument();
    });

    it('Save Description button is disabled when description is unchanged', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      expect(screen.getByTestId('save-description-button')).toBeDisabled();
    });

    it('Save Description button becomes enabled after changing the description', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'New description' } });
      expect(screen.getByTestId('save-description-button')).toBeEnabled();
    });

    it('clicking Save Description calls updateRecipe with the new description', async () => {
      vi.mocked(updateRecipe).mockResolvedValue({
        ...mockRecipe,
        description: 'New description',
      });
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'New description' } });
      fireEvent.click(screen.getByTestId('save-description-button'));

      await waitFor(() =>
        expect(updateRecipe).toHaveBeenCalledWith(1, { description: 'New description' }),
      );
    });

    it('Save Description button is disabled again after saving', async () => {
      vi.mocked(updateRecipe).mockResolvedValue({
        ...mockRecipe,
        description: 'New description',
      });
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'New description' } });
      fireEvent.click(screen.getByTestId('save-description-button'));

      await waitFor(() => expect(screen.getByTestId('save-description-button')).toBeDisabled());
    });

    it('shows UnsavedChangesDialog when clicking Done with unsaved description', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'Unsaved text' } });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));

      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    });

    it('clicking Discard resets description draft and exits edit mode', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'Discardable text' } });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByRole('button', { name: 'Discard' }));

      await waitFor(() => {
        expect(screen.queryByTestId('description-field')).not.toBeInTheDocument();
        expect(screen.getByTestId('description-text')).toHaveTextContent(
          'A classic Italian pasta dish',
        );
      });
    });

    it('clicking Keep Editing closes dialog and stays in edit mode with draft intact', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      const textarea = screen.getByTestId('description-field').querySelector('textarea')!;
      fireEvent.change(textarea, { target: { value: 'Draft text' } });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByRole('button', { name: 'Keep Editing' }));

      await waitFor(() => {
        expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
      });
      expect(screen.getByTestId('description-field')).toBeInTheDocument();
      expect(screen.getByTestId('description-field').querySelector('textarea')).toHaveValue(
        'Draft text',
      );
    });

    it('does not show UnsavedChangesDialog when clicking Done without changes', async () => {
      renderRecipePage();
      await waitFor(() => {
        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));
      fireEvent.click(screen.getByTestId('edit-ingredients-toggle'));

      expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
      expect(screen.queryByTestId('description-field')).not.toBeInTheDocument();
    });
  });
});
