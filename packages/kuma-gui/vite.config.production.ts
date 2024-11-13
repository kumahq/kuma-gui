import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import { hoistUseStatements } from './dev-utilities/hoistUseStatements'
import { fs } from './src/test-support/mocks/fs'
import fakeApi from './src/test-support/vite'
import { replicateKumaServer } from './vite.plugins'
import type { UserConfigFn } from 'vite'
// https://vitejs.dev/config/

export const config: UserConfigFn = () => {
  const md = markdown(
    {
      html: true,
    },
  )
  return {
    base: './',
    server: {
      port: 8080,
    },
    plugins: [
      replicateKumaServer(),
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
        fs,
      }),
      svgLoader(),
      yamlLoader(
        {
          schema: DEFAULT_SCHEMA.extend(
            new Type('tag:yaml.org,2002:text/markdown', {
              kind: 'scalar',
              construct: (data) => {
                // We only currently use !!text/markdown within yaml for out locales/i18n text
                // for which we use FormatJS under the hood. FormatJS requires you to escape any XML/HTML looking
                // things, plus ICU '{' and '}', hence this replace.
                // If we ever need !!text/markdown for anything else we should do something like !!text/icu+markdown
                const str = md.render(data)

                return str.replace(/</g, "'<'")
                  .replace(/%7B/g, '{')
                  .replace(/%7D/g, '}')
              },
            }),
          ),
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
    build: {
      modulePreload: {
        resolveDependencies: () => [],
      },
    },

    test: {
      globals: false,
      environment: 'jsdom',
      setupFiles: [
        './test-support/main.ts',
      ],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'lcovonly'],
        include: ['src'],
        exclude: ['src/test-support/mocks/**'],
      },
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
