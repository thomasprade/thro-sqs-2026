import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { ApiErrorSnackbar } from './components/ApiErrorSnackbar';
import './index.css';
import Home from './pages/Home';
import RecipePage from './pages/RecipePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/recipe/:id',
    element: <RecipePage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ApiErrorSnackbar />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
