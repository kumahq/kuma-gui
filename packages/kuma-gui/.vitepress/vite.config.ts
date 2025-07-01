import { defineConfig } from "vite"
import markdown from 'markdown-it'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import { whyframe } from '@whyframe/core'
import { whyframeVue } from '@whyframe/vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { fileURLToPath, URL } from 'node:url'
import { hoistUseStatements } from '../dev-utilities/hoistUseStatements'
import { kumaIndexHtmlVars } from '../vite.plugins'

export default defineConfig({
  plugins: [
    {
      // in lieu of being able to provide our own index.html insert `{{.}}`
      // into the html first, so that the following kumaIndexHtmlVars plugin
      // works the same
      name: 'kuma-vitepress-gotemplate',
      transformIndexHtml: (template) => {
        return template.replace('<div id="app"></div>', `<div id="app"></div><script type="application/json" id="kuma-config">{{.}}</script>`)
      },
    },
    kumaIndexHtmlVars(),
    whyframe({
      defaultSrc: '/.vitepress/theme/main',
      components: [{ name: 'Story', showSource: true }],
    }),
    whyframeVue({
      include: /\.(?:vue|md)$/,
    }),
    yamlLoader(
      {
        schema: DEFAULT_SCHEMA.extend(
          new Type('tag:yaml.org,2002:text/markdown', {
            kind: 'scalar',
            construct: (data) => {
              const str = 
                markdown(
                  {
                    html: true,
                  },
                ).render(data)
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
      '@': fileURLToPath(new URL('../src', import.meta.url)),
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