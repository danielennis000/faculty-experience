import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** GitHub project Pages URL is /<repo-name>/ (set VITE_BASE_PATH in CI, e.g. /faculty-experience). */
function pagesBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw || raw === '/') {
    return '/';
  }
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export default defineConfig({
  base: pagesBase(),
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
