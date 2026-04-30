import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnsavedChangesDialog from '../UnsavedChangesDialog';

describe('UnsavedChangesDialog', () => {
  it('renders warning text when open', () => {
    render(<UnsavedChangesDialog open={true} onDiscard={vi.fn()} onKeepEditing={vi.fn()} />);
    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    expect(
      screen.getByText('You have unsaved changes. Do you want to discard them?'),
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<UnsavedChangesDialog open={false} onDiscard={vi.fn()} onKeepEditing={vi.fn()} />);
    expect(screen.queryByText('Unsaved Changes')).not.toBeInTheDocument();
  });

  it('calls onDiscard when Discard is clicked', async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    render(<UnsavedChangesDialog open={true} onDiscard={onDiscard} onKeepEditing={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /discard/i }));
    expect(onDiscard).toHaveBeenCalled();
  });

  it('calls onKeepEditing when Keep Editing is clicked', async () => {
    const user = userEvent.setup();
    const onKeepEditing = vi.fn();
    render(<UnsavedChangesDialog open={true} onDiscard={vi.fn()} onKeepEditing={onKeepEditing} />);
    await user.click(screen.getByRole('button', { name: /keep editing/i }));
    expect(onKeepEditing).toHaveBeenCalled();
  });
});
