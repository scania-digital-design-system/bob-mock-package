import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { cellExport } from './build/cell-export';

export default defineConfig({
  plugins: [cellExport(), react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
  },
});
