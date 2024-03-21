import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { marked } from 'marked'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import { hoistUseStatements } from './dev-utilities/hoistUseStatements'
import { services, TOKENS } from './src/services/development'
import fakeApi from './src/test-support/vite'
import type Env from '@/services/env/Env'
import { build, token } from '@/services/utils'
import type { UserConfigFn } from 'vite'
// https://vitejs.dev/config/

export const config: UserConfigFn = () => {
  const $ = {
    ...TOKENS,
    // none of the following are used in vite
    i18n: token('i18n'),
    mswHandlers: token('msw.handlers'),
    components: token('components'),
    env: token<Env['var']>('env'),
  }
  const get = build(
    services($),
  )
  marked.use({
    gfm: true,
  })
  return {
    base: './',
    server: {
      port: 8080,
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            whitespace: 'preserve',
          },
        },
      }),
      fakeApi({
        fs: get($.fakeFS),
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
                const str = marked(data) as string
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
            @import "@kong/design-tokens/tokens/scss/variables";
          `),
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
