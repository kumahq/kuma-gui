/* THIS IS THE VITEPRESS CONFIG */

import yamlLoader from '@modyfi/vite-plugin-yaml'
import { whyframe } from '@whyframe/core'
import { whyframeVue } from '@whyframe/vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { marked } from 'marked'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { hoistUseStatements } from './dev-utilities/hoistUseStatements'

export default defineConfig({
  plugins: [
    whyframe({
      defaultSrc: '/docs/frames/default',
    }),
    whyframeVue({
      include: /\.md$/,
    }),
    yamlLoader(
      {
        schema: DEFAULT_SCHEMA.extend(
          new Type('tag:yaml.org,2002:text/markdown', {
            kind: 'scalar',
            construct: (data) => {
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
})
