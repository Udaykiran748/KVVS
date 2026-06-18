import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            if (res && !res.headersSent) {
               res.writeHead(502, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ error: 'Backend down' }));
            }
          });
        }
      },

      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            if (res && !res.headersSent) {
               res.writeHead(502, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ error: 'Backend down' }));
            }
          });
        }
      }
    }
  }
});
