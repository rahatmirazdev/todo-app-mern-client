import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // These headers are required for Firebase popup authentication
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }, proxy: {      // Proxy API requests to backend
      '/api': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://todo-app-mern-server-a9rx.onrender.com'
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },      // Proxy root path for backend status checks
      '^/$': {
        target: 'https://todo-app-mern-server-a9rx.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
