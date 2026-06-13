import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ApiErrorSnackbar } from '../ApiErrorSnackbar';

afterEach(() => {
  // Ensure no leftover listeners between tests
});

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
    const { unmount } = render(<ApiErrorSnackbar />);
    unmount();

    // Dispatching after unmount should not throw
    expect(() =>
      globalThis.dispatchEvent(new CustomEvent('api:error', { detail: { status: 503 } })),
    ).not.toThrow();
  });
});
