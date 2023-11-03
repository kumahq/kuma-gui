import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { marked } from 'marked'
import { fileURLToPath, URL } from 'url'
import { defineConfig, UserConfigFn } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import svgLoader from 'vite-svg-loader'

import { hoistUseStatements } from './dev-utilities/hoistUseStatements'
import { getPathConfigDefault } from './src/services/env/Env'

dotenv.config()

// https://vitejs.dev/config/

export const config: UserConfigFn = ({ mode }) => {
  const pathConfigDefault = getPathConfigDefault(process.env.VITE_KUMA_API_SERVER_URL as string)
  marked.use({
    gfm: true,
  })
  return {
    base: './',
    server: {
      port: 8080,
    },
    plugins: [
      /**
       * Workaround for a bug with Vite serving a 404 page for routes that contain a “.” character.
       *
       * Issue: https://github.com/vitejs/vite/issues/2415.
       */
      pluginRewriteAll(),
      vue({
        template: {
          compilerOptions: {
            whitespace: 'preserve',
          },
        },
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
                return marked(data).replace(/</g, "'<'")
                  .replace(/%7B/g, '{')
                  .replace(/%7D/g, '}')
              },
            }),
          ),
        },
      ),
      createHtmlPlugin({
        inject: {
          data: {
            /**
             * Adds the appropriate GUI base path placeholder to the index.html file. It is going to be replaced using server-side templating when serving the GUI application in production.
             */
            baseGuiPath: mode === 'production' ? '{{.BaseGuiPath}}' : pathConfigDefault.baseGuiPath,
            config: mode === 'production' ? '{{.}}' : JSON.stringify(pathConfigDefault),
          },
        },
      }),
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
        exclude: ['cypress/**'],
      },
      deps: {
        optimizer: {
          web: {
          // https://github.com/vitest-dev/vitest/issues/4074
            exclude: ['vue'],
          },
        },
      },
      include: ['**/src/**/*.spec.ts'],
      exclude: [
        '**/dist/**',
        '**/__template__/**',
        '**/node_modules/**',
        'apps/_cli/**',
      ],
    },
  }
}
export default defineConfig(config)
