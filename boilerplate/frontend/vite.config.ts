import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// NOTE: @midnight-ntwrk/compact-runtime uses require() (CJS) to load WASM
// with top-level await. Rolldown (Vite 8) cannot bundle this combination.
// We exclude these packages from optimization and externalize them from the
// production bundle. They are loaded via the Midnight SDK's own bundling.
export default defineConfig({
  plugins: [react()],
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
    ],
  },
})
