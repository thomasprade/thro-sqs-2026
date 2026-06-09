import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../../auth/AuthContext';

const TOKEN_KEY = 'auth_token';

function TestConsumer() {
  const { token, isLoggedIn, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="logged-in">{String(isLoggedIn)}</span>
      <button onClick={() => login('test-jwt')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides null token when nothing in localStorage', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
  });

  it('reads token from localStorage on mount', () => {
    localStorage.setItem(TOKEN_KEY, 'existing-token');
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('token')).toHaveTextContent('existing-token');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
  });

  it('login() stores token in state and localStorage', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Login' }).click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('test-jwt');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('test-jwt');
  });

  it('logout() clears token from state and localStorage', async () => {
    localStorage.setItem(TOKEN_KEY, 'existing-token');
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByRole('button', { name: 'Logout' }).click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('shows snackbar on auth:unauthorized event', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await act(async () => {
      globalThis.dispatchEvent(new Event('auth:unauthorized'));
    });

    expect(screen.getByText(/session expired or unauthorized/i)).toBeInTheDocument();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    consoleSpy.mockRestore();
  });
});
