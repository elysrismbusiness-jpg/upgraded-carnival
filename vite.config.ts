import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/upgraded-carnival/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
