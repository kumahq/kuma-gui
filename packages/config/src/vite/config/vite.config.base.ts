/// <reference types="vitest/config" />
import path from 'node:path'

import { hoistUseStatements } from '.'
import type { UserConfig, UserConfigFn } from 'vite'


export const defineConfig: UserConfigFn = () => ({
  base: './',
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      /**
       * Used to import files using, for example, '@/api/kumaApi'.
       */
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: hoistUseStatements(`
            @use "@kong/design-tokens/tokens/scss/variables" as *;
          `),
        api: 'modern-compiler',
      },
    },
  },

  test: {
    globals: false,
    environment: 'jsdom',
    deps: {
      optimizer: {
        web: {
          // https://github.com/vitest-dev/vitest/issues/4074
          exclude: ['vue'],
        },
      },
    },
    include: [
      '**/src/**/*.spec.ts',
    ],
    exclude: [
      '**/dist/**',
      '**/node_modules/**',
    ],
  },
}) satisfies UserConfig
