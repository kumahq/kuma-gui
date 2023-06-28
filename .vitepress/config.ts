import { defineConfig } from 'vitepress'
import { globSync } from 'glob'

const files = globSync('./src/**/README.md').map(item => {
  const parts = item.split('/')
  const name = parts[parts.length - 2]
  if(['services', 'mocks'].includes(name)) {
    return;
  }
  return {
    text: name,
    link: item
  }
}).filter(Boolean)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kuma-gui',
  description: '',
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          {
            text: 'Services',
            link: 'src/services/README.md'
          },
          {
            text: 'API Mocking',
            link: 'src/test-support/mocks/README.md'
          }
        ]
      },
      {
        text: 'Services',
        items: files
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kumahq/kuma-gui' }
    ]
  }
})
