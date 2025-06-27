import { replicateKumaServer, yamlSchema } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import { readFile } from 'fs/promises'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import { hoistUseStatements } from './dev-utilities/hoistUseStatements'
import { dependencies } from './src/test-support'
import { fs } from './src/test-support/mocks/fs'
import type { UserConfigFn } from 'vite'
// https://vitejs.dev/config/

const cwd = process.cwd()
const read = async (path: string) => (await readFile(`${cwd}/${path}`)).toString()
const version = JSON.parse((await read('./package.json'))).version

const vars = {
  version,
  baseGuiPath: '/gui',
  apiUrl: 'http://localhost:5681',
  product: 'Kuma', // we no longer use this, it can be removed in the backend
  mode: 'global',
  environment: 'universal',
  storeType: 'postgres',
  apiReadOnly: false,
}
export const config: UserConfigFn = () => {
  return {
    base: './',
    server: {
      port: 8080,
    },
    plugins: [
      replicateKumaServer(vars),
      vue({
        template: {
          compilerOptions: {
            whitespace: 'preserve',
            isCustomElement: (item) => [
              'search',
            ].includes(item),
          },
        },
      }),
      fakeApi({
        dependencies,
        fs,
      }),
      svgLoader(),
      yamlLoader(
        {
          schema: yamlSchema(),
        },
      ),
    ],
    resolve: {
      alias: {
        /**
         * Used to import files using, for example, '@/api/kumaApi'.
         */
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
      provide: {
        vars,
      },
      setupFiles: [
        './test-support/main.ts',
      ],
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
  }
}
export default defineConfig(config)
