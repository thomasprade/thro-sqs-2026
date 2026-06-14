import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export function ApiErrorSnackbar() {
  const [open, setOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);

  useEffect(() => {
    const handleApiError = () => {
      setSnackbarKey((prev) => prev + 1);
      setOpen(true);
    };
    globalThis.addEventListener('api:error', handleApiError);
    return () => globalThis.removeEventListener('api:error', handleApiError);
  }, []);

  return (
    <Snackbar
      key={snackbarKey}
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
