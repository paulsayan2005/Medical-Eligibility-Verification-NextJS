import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// NOTE: @midnight-ntwrk/compact-runtime uses require() (CJS) to load WASM
// with top-level await. Rolldown (Vite 8) cannot bundle this combination.
// We exclude these packages from optimization and externalize them from the
// production bundle. They are loaded via the Midnight SDK's own bundling.
//
// NOTE: @midnight-ntwrk/contract is a local workspace package (pre-compiled JS).
// It is also externalized to prevent OXC from trying to transform its dist files.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@midnight-ntwrk/contract': path.resolve(__dirname, '../contract/dist/index.js'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        '@midnight-ntwrk/compact-runtime',
        '@midnight-ntwrk/onchain-runtime',
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/onchain-runtime',
      '@midnight-ntwrk/contract',
      'pino-pretty',
    ],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
