import type { Ingredient } from '@app/shared';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IngredientFormDialog from '../IngredientFormDialog';

const mockIngredient: Ingredient = {
  id: 1,
  recipeId: 1,
  name: 'Flour',
  amount: 200,
  unit: 'g',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('IngredientFormDialog', () => {
  describe('Add mode', () => {
    it('renders with empty fields', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByRole('heading', { name: 'Add Ingredients' })).toBeInTheDocument();
      const nameInput = screen.getByTestId('ingredient-name-0').querySelector('input');
      expect(nameInput).toHaveValue('');
    });

    it('save button is disabled when fields are empty', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('save button is enabled when all fields are filled', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      fireEvent.change(screen.getByTestId('ingredient-name-0').querySelector('input')!, {
        target: { value: 'Sugar' },
      });
      fireEvent.change(screen.getByTestId('ingredient-amount-0').querySelector('input')!, {
        target: { value: '100' },
      });
      fireEvent.change(screen.getByTestId('ingredient-unit-0').querySelector('input')!, {
        target: { value: 'g' },
      });
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('can add another row', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      fireEvent.click(screen.getByTestId('add-another-row'));
      expect(screen.getByTestId('ingredient-name-1')).toBeInTheDocument();
    });

    it('calls onSave with array of dtos', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={onSave}
          onClose={vi.fn()}
        />,
      );
      fireEvent.change(screen.getByTestId('ingredient-name-0').querySelector('input')!, {
        target: { value: 'Sugar' },
      });
      fireEvent.change(screen.getByTestId('ingredient-amount-0').querySelector('input')!, {
        target: { value: '100' },
      });
      fireEvent.change(screen.getByTestId('ingredient-unit-0').querySelector('input')!, {
        target: { value: 'g' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith([{ name: 'Sugar', amount: 100, unit: 'g' }]);
      });
    });

    it('calls onClose when cancel is clicked', () => {
      const onClose = vi.fn();
      render(
        <IngredientFormDialog
          open={true}
          ingredient={undefined}
          onSave={vi.fn()}
          onClose={onClose}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Edit mode', () => {
    it('renders with pre-filled fields', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={mockIngredient}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(screen.getByRole('heading', { name: 'Edit Ingredient' })).toBeInTheDocument();
      expect(screen.getByTestId('ingredient-name-0').querySelector('input')).toHaveValue('Flour');
      expect(screen.getByTestId('ingredient-amount-0').querySelector('input')).toHaveValue(200);
      expect(screen.getByTestId('ingredient-unit-0').querySelector('input')).toHaveValue('g');
    });

    it('does not show "Add another" button', () => {
      render(
        <IngredientFormDialog
          open={true}
          ingredient={mockIngredient}
          onSave={vi.fn()}
          onClose={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('add-another-row')).not.toBeInTheDocument();
    });

    it('calls onSave with updated dto', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(
        <IngredientFormDialog
          open={true}
          ingredient={mockIngredient}
          onSave={onSave}
          onClose={vi.fn()}
        />,
      );
      fireEvent.change(screen.getByTestId('ingredient-name-0').querySelector('input')!, {
        target: { value: 'Whole Wheat Flour' },
      });
      fireEvent.change(screen.getByTestId('ingredient-amount-0').querySelector('input')!, {
        target: { value: '250' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({ name: 'Whole Wheat Flour', amount: 250, unit: 'g' });
      });
    });
  });
});
