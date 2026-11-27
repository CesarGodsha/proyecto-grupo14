import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(frontendRoot, '../../..');

export default defineConfig({
  root: frontendRoot,
  envDir: frontendRoot,
  resolve: {
    alias: { react: path.join(frontendRoot, 'node_modules/react') },
  },
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    fs: { allow: [repositoryRoot] },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: { outDir: path.join(frontendRoot, 'dist'), emptyOutDir: true },
});
