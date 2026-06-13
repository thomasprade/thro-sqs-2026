import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export function ApiErrorSnackbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleApiError = () => {
      setOpen(true);
    };
    globalThis.addEventListener('api:error', handleApiError);
    return () => globalThis.removeEventListener('api:error', handleApiError);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={() => setOpen(false)}>
        A request failed. Please try again.
      </Alert>
    </Snackbar>
  );
}
