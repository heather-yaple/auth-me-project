//frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'https://auth-me-project-yqht.onrender.com/' : 'http://localhost:8000',        changeOrigin: true,
      },
    },
  },
})