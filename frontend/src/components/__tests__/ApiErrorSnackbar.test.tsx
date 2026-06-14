import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiErrorSnackbar } from '../ApiErrorSnackbar';

describe('ApiErrorSnackbar', () => {
  it('is not visible initially', () => {
    render(<ApiErrorSnackbar />);
    expect(screen.queryByText(/a request failed/i)).not.toBeInTheDocument();
  });

  it('shows error snackbar when api:error event is dispatched', async () => {
    render(<ApiErrorSnackbar />);

    globalThis.dispatchEvent(new CustomEvent('api:error', { detail: { status: 500 } }));

    expect(await screen.findByText(/a request failed/i)).toBeInTheDocument();
  });

  it('closes snackbar when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApiErrorSnackbar />);

    globalThis.dispatchEvent(new CustomEvent('api:error', { detail: { status: 500 } }));
    expect(await screen.findByText(/a request failed/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => expect(screen.queryByText(/a request failed/i)).not.toBeInTheDocument());
  });

  it('removes the event listener on unmount', () => {
    const addSpy = vi.spyOn(globalThis, 'addEventListener');
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
    const { unmount } = render(<ApiErrorSnackbar />);
    const handler = addSpy.mock.calls.find(([event]) => event === 'api:error')?.[1] as
      | EventListener
      | undefined;
    unmount();

    expect(handler).toBeTruthy();
    expect(removeSpy).toHaveBeenCalledWith('api:error', handler);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
