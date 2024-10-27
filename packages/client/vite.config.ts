import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { key, cert } from '../shared/certs.mts';

export default defineConfig({
  plugins: [tsconfigPaths()],
  server: {
    port: 8080,
    https: {
      key,
      cert,
    },
    proxy: {
      '/api': {
        secure: false,
        target: 'https://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});