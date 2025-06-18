import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
  resolve: {
    alias: {
      '@server': path.resolve(__dirname, '../server/src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
})
