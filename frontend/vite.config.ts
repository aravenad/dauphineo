import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages sert le site sous https://aravenad.github.io/dauphineo/
  base: mode === 'pages' ? '/dauphineo/' : '/',
  plugins: [react()],
  // Les données de démo sont lues dans ../backend/database/data
  server: { fs: { allow: ['..'] } },
  build: {
    rollupOptions: {
      output: {
        // MUI pèse plus lourd que l'application : un fichier à part se met en cache plus longtemps
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
}))
