import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/socket\.io/, ''),
      },
    },
  },
  plugins: [react()],
})
