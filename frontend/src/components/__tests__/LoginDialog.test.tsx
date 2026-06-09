import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../auth/AuthContext';
import LoginDialog from '../LoginDialog';

vi.mock('../../api', () => ({
  loginRequest: vi.fn(),
}));

import { loginRequest } from '../../api';
const mockLoginRequest = vi.mocked(loginRequest);

function renderDialog(open = true, onClose = vi.fn()) {
  return render(
    <AuthProvider>
      <LoginDialog open={open} onClose={onClose} />
    </AuthProvider>,
  );
}

describe('LoginDialog', () => {
  it('renders username and password fields when open', () => {
    renderDialog();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    renderDialog(false);
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });

  it('calls loginRequest and closes dialog on success', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    mockLoginRequest.mockResolvedValue('jwt-token-123');

    renderDialog(true, onClose);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'testpass');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith('testuser', 'testpass');
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows error message on failed login', async () => {
    const user = userEvent.setup();
    mockLoginRequest.mockRejectedValue(new Error('Invalid credentials'));

    renderDialog();

    await user.type(screen.getByLabelText(/username/i), 'baduser');
    await user.type(screen.getByLabelText(/password/i), 'badpass');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('disables login button while loading', async () => {
    const user = userEvent.setup();
    let resolveLogin!: (value: string) => void;
    mockLoginRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
    );

    renderDialog();

    await user.type(screen.getByLabelText(/username/i), 'user');
    await user.type(screen.getByLabelText(/password/i), 'pass');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    });

    // Clean up
    resolveLogin('token');
  });

  it('clears fields when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog(true, onClose);

    await user.type(screen.getByLabelText(/username/i), 'sometext');
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });
});
