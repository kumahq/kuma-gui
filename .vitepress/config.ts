import { defineConfig, DefaultTheme } from 'vitepress'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import { whyframe } from '@whyframe/core'
import { whyframeVue } from '@whyframe/vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import { marked } from 'marked'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig as viteConfig } from 'vite'

import { hoistUseStatements } from '../dev-utilities/hoistUseStatements'
import { sync as globSync } from 'glob'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kuma-gui',
  description: '',
  vite: viteConfig({
    plugins: [
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
  }),
  markdown: {
    config: (md) => {
      // md.use()
    }
  },
  cleanUrls: true,
  ignoreDeadLinks: [
    // ignore all localhost links
    /^https?:\/\/localhost/,
  ],
  themeConfig: {
    sidebar: [
      {
        text: 'Overview',
        items: [
          {
            text: 'TLDR',
            link: 'docs/tldr.md',
          },
          {
            text: 'Getting started',
            link: 'docs/getting-started.md',
          },
          {
            text: 'Modules',
            link: 'docs/modules.md',
          },
          {
            text: 'Routing',
            link: 'docs/routing.md',
          },
          {
            text: 'Services',
            link: 'src/services/README.md',
          },
          {
            text: 'API Mocking',
            link: 'src/test-support/mocks/README.md',
          },
          {
            text: 'Releasing a new Kuma version',
            link: 'docs/releasing.md',
          },
        ]
      },
      {
        text: 'Components',
        items: [
          ...getSourceItems('src/**/{components,views}/**/README.md'),
          ...getSourceItems('src/app/common/**/README.md'),
        ],
      },
      {
        text: 'Services',
        items: getSourceItems('src/**/services/**/README.md', ['services']),
      },
    ],
  }
})

function getSourceItems(pattern: string, excluded: string[] = []): DefaultTheme.SidebarItem[] {
  const items: Array<{ text: string, link: string }> = globSync(pattern)
    .map((link) => {
      const parts = link.split('/')
      const text = parts[parts.length - 2]

      if (excluded.includes(text)) {
        return null
      }

      return { text, link }
    })
    .filter(notEmpty)

  items.sort((itemA, itemB) => itemA.text.localeCompare(itemB.text))

  return items
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
