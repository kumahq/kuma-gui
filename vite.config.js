import { defineConfig } from 'vite'
import path from 'path'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  // For testing, you may set the base path to a less conventional value to resemble a real user environment more closely. Annoyingly, this currently **requires** the trailing slash to be added in the URL. Navigating to http://localhost:8080/dev/gui will **not** work; http://localhost:8080/dev/gui/ will.
  // Issue: https://github.com/vitejs/vite/issues/9236
  // Fix in vite v4: https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-alpha1-2022-11-12
  // base: '/dev/gui/',
  server: {
    port: 8080,
  },
  plugins: [
    // Workaround for a bug with Vite serving a 404 page for routes that contain a “.” character.
    // Issue: https://github.com/vitejs/vite/issues/2415.
    pluginRewriteAll(),
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
})
