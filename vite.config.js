import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(function ({ mode }) {
  return {
    // Under no circumstances (except for the value `'./'`) should `base` be set to a value that doesn’t have a leading and trailing slash. Vite **will** always add a leading and trailing slash unless they’re present. For this reason, `{{.BaseGuiPath}}` must never have a leading or trailing slash.
    base: mode === 'production' ? '/{{.BaseGuiPath}}/' : './',
    // For testing, you may set the base path to a less conventional value to resemble a real user environment more closely. Annoyingly, this currently **requires** the trailing slash to be added in the URL. Navigating to http://localhost:8080/dev/gui will **not** work; http://localhost:8080/dev/gui/ will. Issue: https://github.com/vitejs/vite/issues/9236
    // base: '/dev/gui/',
    server: {
      port: 8080,
    },
    plugins: [
      vue(),
      svgLoader(),
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
