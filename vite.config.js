import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

import { PATH_CONFIG_DEFAULT } from './src/pathConfigDefault'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(function ({ mode }) {
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
      vue(),
      svgLoader(),
      createHtmlPlugin({
        inject: {
          data: {
            /**
             * Adds the appropriate GUI base path placeholder to the index.html file. It is going to be replaced using server-side templating when serving the GUI application in production.
             */
            baseGuiPath: mode === 'production' ? '{{.BaseGuiPath}}' : PATH_CONFIG_DEFAULT.baseGuiPath,
            config: mode === 'production' ? '{{.}}' : JSON.stringify(PATH_CONFIG_DEFAULT),
          },
        },
      }),
    ],
    resolve: {
      alias: {
        /**
         * Used to import files using, for example, '@/api/kumaApi'.
         */
        '@': path.resolve('./src'),
      },
    },
  }
})
