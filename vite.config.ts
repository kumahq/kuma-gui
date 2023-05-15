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

import { getPathConfigDefault } from './src/pathConfigDefault'

dotenv.config()

// https://vitejs.dev/config/

export const config: UserConfigFn = ({ mode }) => {
  const pathConfigDefault = getPathConfigDefault(process.env.VITE_KUMA_API_SERVER_URL as string)

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
                return marked(data)
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
    build: {
      modulePreload: {
        resolveDependencies: () => [],
      },
    },
  }
}
export default defineConfig(config)
