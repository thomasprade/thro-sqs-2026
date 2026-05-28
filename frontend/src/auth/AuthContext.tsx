import { Alert, Snackbar } from '@mui/material';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'auth_token';

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setSnackbarOpen(true);
    };
    globalThis.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => globalThis.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({ token, isLoggedIn: !!token, login, logout }),
    [token, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setSnackbarOpen(false)}>
          Session expired or unauthorized. Please log in.
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
