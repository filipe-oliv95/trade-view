import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

import { settings } from './src/lib/electron-router-dom'

import copy from 'rollup-plugin-copy'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['better-sqlite3'],
      }
    }
  },

  preload: {
    input: resolve(__dirname, 'src/preload/index.js'), 
    output: {
      dir: resolve(__dirname, 'out/preload'), 
    },
    build: {
      rollupOptions: {
        external: ['better-sqlite3'], 
      }
    }
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },

    plugins: [react()],

    server: {
      port: settings.port,
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            { src: 'src/database/**/*', dest: 'out/database' }, 
          ],
          hook: 'writeBundle', 
        }),
      ],
    },
  },
})
