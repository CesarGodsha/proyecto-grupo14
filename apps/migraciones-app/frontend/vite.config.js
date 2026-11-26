import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: frontendRoot,
  envDir: frontendRoot,
  plugins: [react()],
  server: {
    port: 5176,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
  build: { outDir: path.join(frontendRoot, 'dist'), emptyOutDir: true },
});
