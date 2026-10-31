import { defineConfig, loadEnv, searchForWorkspaceRoot, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Politique de sécurité du contenu ajoutée au build seulement : le serveur de dev de Vite
 * injecte des scripts en ligne pour le rechargement à chaud. GitHub Pages ne permet pas
 * d'en-têtes HTTP, d'où la balise meta.
 */
function csp(origineApi: string | null): Plugin {
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    // MUI (emotion) insère ses styles dans des balises <style> générées à l'exécution
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://thumb.wikimedia.org https://upload.wikimedia.org",
    ['connect-src', "'self'", 'https://nominatim.openstreetmap.org', origineApi].filter(Boolean).join(' '),
    'frame-src https://www.openstreetmap.org',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  return {
    name: 'dauphineo-csp',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: directives.join('; ') }, injectTo: 'head-prepend' },
      { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const origineApi = env.VITE_API_MODE === 'demo' ? null : new URL(env.VITE_API_URL ?? 'http://localhost:8000/api').origin

  return {
    // GitHub Pages sert le site sous https://aravenad.github.io/dauphineo/
    base: mode === 'pages' ? '/dauphineo/' : '/',
    plugins: [react(), csp(origineApi)],
    // Les données de démo sont lues dans ../backend/database/data, et rien d'autre hors du frontend
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '../backend/database/data'] } },
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
  }
})
