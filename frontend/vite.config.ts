import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.INSTRUMENT_COVERAGE
      ? [
          istanbul({
            include: 'src/**/*',
            exclude: ['node_modules', 'test/', 'e2e/'],
            extension: ['.ts', '.tsx'],
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@app/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
