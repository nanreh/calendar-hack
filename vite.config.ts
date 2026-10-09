import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// The pages the router serves besides the home page. The web server only knows about files, so
// each page gets a copy of index.html at its own path. Without that, a direct link to the page
// or a reload while on it is a 404.
const ROUTES = ['about']

function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      for (const route of ROUTES) {
        mkdirSync(resolve(outDir, route), { recursive: true })
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, route, 'index.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticRoutes()],
  "base": "/hacks/calendarhack/",
})
