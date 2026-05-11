import type { Recipe } from '@app/shared';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RecipeFormDialog from '../RecipeFormDialog';

const mockRecipe: Recipe = {
  id: 1,
  title: 'Pasta',
  description: 'Simple pasta dish',
  author: 'Alice',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('RecipeFormDialog', () => {
  describe('add mode', () => {
    it('renders with empty fields and "Add Recipe" title', () => {
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />);
      expect(screen.getByText('Add Recipe')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/author/i)).toHaveValue('');
    });

    it('Save button is disabled when title is empty', () => {
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('Save button is enabled when title has text', async () => {
      const user = userEvent.setup();
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />);
      await user.type(screen.getByLabelText(/title/i), 'Test');
      expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
    });

    it('calls onSave with correct dto', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(<RecipeFormDialog open={true} onSave={onSave} onClose={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Pasta');
      await user.type(screen.getByLabelText(/description/i), 'A simple dish');
      await user.type(screen.getByLabelText(/author/i), 'Alice');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onSave).toHaveBeenCalledWith({
        title: 'Pasta',
        description: 'A simple dish',
        author: 'Alice',
      });
    });

    it('calls onClose directly when cancel is clicked with no changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={onClose} />);
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toHaveBeenCalled();
    });

    it('shows unsaved changes warning when cancel is clicked with dirty fields', async () => {
      const user = userEvent.setup();
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={vi.fn()} />);

      await user.type(screen.getByLabelText(/title/i), 'Something');
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
      expect(
        screen.getByText('You have unsaved changes. Do you want to discard them?'),
      ).toBeInTheDocument();
    });

    it('"Discard" in warning dialog closes the form', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={onClose} />);

      await user.type(screen.getByLabelText(/title/i), 'Something');
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await user.click(screen.getByRole('button', { name: /discard/i }));

      expect(onClose).toHaveBeenCalled();
    });

    it('"Keep Editing" in warning dialog keeps the form open', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<RecipeFormDialog open={true} onSave={vi.fn()} onClose={onClose} />);

      await user.type(screen.getByLabelText(/title/i), 'Something');
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await user.click(screen.getByRole('button', { name: /keep editing/i }));

      expect(onClose).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
      });
    });
  });

  describe('edit mode', () => {
    it('renders with pre-filled fields and "Edit Recipe" title', () => {
      render(
        <RecipeFormDialog open={true} recipe={mockRecipe} onSave={vi.fn()} onClose={vi.fn()} />,
      );
      expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue('Pasta');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Simple pasta dish');
      expect(screen.getByLabelText(/author/i)).toHaveValue('Alice');
    });

    it('calls onSave with updated values', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn().mockResolvedValue(undefined);
      render(
        <RecipeFormDialog open={true} recipe={mockRecipe} onSave={onSave} onClose={vi.fn()} />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'New Pasta');
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(onSave).toHaveBeenCalledWith({
        title: 'New Pasta',
        description: 'Simple pasta dish',
        author: 'Alice',
      });
    });

    it('closes without warning when no changes were made', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <RecipeFormDialog open={true} recipe={mockRecipe} onSave={vi.fn()} onClose={onClose} />,
      );
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toHaveBeenCalled();
    });

    it('shows warning when fields were modified and cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RecipeFormDialog open={true} recipe={mockRecipe} onSave={vi.fn()} onClose={vi.fn()} />,
      );

      await user.type(screen.getByLabelText(/title/i), ' extra');
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    });
  });

  it('does not render when open is false', () => {
    render(<RecipeFormDialog open={false} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText('Add Recipe')).not.toBeInTheDocument();
  });
});
