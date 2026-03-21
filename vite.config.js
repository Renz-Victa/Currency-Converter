import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/Live-FX-Conversion-Tool/',
  plugins: [react()],
});
