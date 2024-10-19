//frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'https://auth-me-project-yqht.onrender.com/' : 'http://localhost:5000',        changeOrigin: true,
      },
    },
  },
})