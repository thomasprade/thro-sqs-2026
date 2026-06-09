import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../auth/AuthContext';

export const AUTH_TOKEN_KEY = 'auth_token';
export const TEST_TOKEN = 'test-token';

export function renderWithRouter(ui: ReactElement) {
  return render(
    <AuthProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthProvider>,
  );
}
