import { defineConfig, DefaultTheme } from 'vitepress'
import { sync as globSync } from 'glob'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kuma-gui',
  description: '',
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
        items: getSourceItems('src/**/{components,views}/**/README.md'),
      },
      {
        text: 'Services',
        items: getSourceItems('src/**/services/**/README.md', ['services']),
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kumahq/kuma-gui' }
    ]
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
