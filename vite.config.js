import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(function ({ mode }) {
  return {
    // Sets the GUI to a less conventional base path so the testing environment more closely resembles real user scenarios.
    base: mode === 'production' ? './' : '/dev/gui/',
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
