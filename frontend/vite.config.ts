import { defineConfig, loadEnv, searchForWorkspaceRoot, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

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

/**
 * Les polices sont déclarées dans le CSS que MUI injecte après le démarrage du JavaScript :
 * sans préchargement, le navigateur ne les découvre qu'en dernier.
 */
function prechargerPolices(fichiers: string[]): Plugin {
  let base = '/'
  return {
    name: 'dauphineo-polices',
    apply: 'build',
    configResolved: (config) => {
      base = config.base
    },
    transformIndexHtml: (_html, ctx) =>
      Object.values(ctx.bundle ?? {})
        .filter((sortie) => fichiers.some((nom) => sortie.fileName.includes(`/${nom}-`)))
        .map((sortie) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: base + sortie.fileName, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        })),
  }
}

/**
 * GitHub Pages ne connaît pas les routes de l'application : sans fichier à l'adresse demandée,
 * il répond 404.html avec un statut 404, même si l'application affiche ensuite la bonne page.
 * Une copie de index.html par route donne un statut 200 aux liens partagés et aux moteurs de recherche.
 */
function routesPages(): Plugin {
  let sortie = 'dist'
  const ids = readFileSync('../backend/database/data/spr.csv', 'utf8')
    .trim()
    .split('\n')
    .slice(1)
    .map((ligne) => ligne.split(';')[0])
  const routes = ['explorer', 'reglementation', 'faq', 'mentions-legales', 'cgu', 'mon-compte', '404', ...ids.map((id) => `spr/${id}`)]
  return {
    name: 'dauphineo-routes-pages',
    apply: 'build',
    configResolved: (config) => {
      sortie = config.build.outDir
    },
    closeBundle: () => {
      const index = readFileSync(join(sortie, 'index.html'))
      for (const route of routes) {
        const fichier = join(sortie, `${route}.html`)
        mkdirSync(dirname(fichier), { recursive: true })
        writeFileSync(fichier, index)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const origineApi = env.VITE_API_MODE === 'demo' ? null : new URL(env.VITE_API_URL ?? 'http://localhost:8000/api').origin

  return {
    // GitHub Pages sert le site sous https://aravenad.github.io/dauphineo/
    base: mode === 'pages' ? '/dauphineo/' : '/',
    plugins: [react(), csp(origineApi), prechargerPolices(['Satoshi-Regular', 'Satoshi-Black']), mode === 'pages' && routesPages()],
    // Les données de démo sont lues dans ../backend/database/data, et rien d'autre hors du frontend
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), '../backend/database/data'] } },
    build: {
      rollupOptions: {
        output: {
          // React change rarement : un fichier à part reste en cache d'une version à l'autre. Les composants
          // MUI restent avec les pages qui les utilisent, pour que l'accueil ne télécharge pas ceux des autres pages.
          manualChunks: (id) => (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id) ? 'react' : undefined),
        },
      },
    },
  }
})
