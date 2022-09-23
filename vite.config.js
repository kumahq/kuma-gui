import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
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
       * Used to import files using, for example, '@/services/kuma'.
       */
      '@': path.resolve('./src'),
    },
  },
})
