import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IngredientToolbar from '../IngredientToolbar';
import { renderWithRouter } from './test.helper';

describe('IngredientToolbar', () => {
  const defaultProps = {
    editing: false,
    portions: 1,
    hasIngredients: true,
    onPortionsChange: vi.fn(),
    onToggleEdit: vi.fn(),
    onAddClick: vi.fn(),
  };

  it('does not update portions when input value is invalid', () => {
    const onPortionsChange = vi.fn();
    renderWithRouter(<IngredientToolbar {...defaultProps} onPortionsChange={onPortionsChange} />);

    const input = screen.getByTestId('portions-input').querySelector('input')!;
    // Browsers report '' for invalid number input values (e.g. typing "e")
    fireEvent.change(input, { target: { value: '' } });

    expect(onPortionsChange).not.toHaveBeenCalled();
  });

  it('updates portions with valid numeric input', () => {
    const onPortionsChange = vi.fn();
    renderWithRouter(<IngredientToolbar {...defaultProps} onPortionsChange={onPortionsChange} />);

    const input = screen.getByTestId('portions-input').querySelector('input')!;
    fireEvent.change(input, { target: { value: '3' } });

    expect(onPortionsChange).toHaveBeenCalledWith(3);
  });

  it('clamps portions to minimum 0.5', () => {
    const onPortionsChange = vi.fn();
    renderWithRouter(<IngredientToolbar {...defaultProps} onPortionsChange={onPortionsChange} />);

    const input = screen.getByTestId('portions-input').querySelector('input')!;
    fireEvent.change(input, { target: { value: '0' } });

    expect(onPortionsChange).toHaveBeenCalledWith(0.5);
  });
});
