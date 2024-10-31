import { defineConfig, DefaultTheme } from 'vitepress'
import { readFileSync as read } from 'node:fs'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import { whyframe } from '@whyframe/core'
import { whyframeVue } from '@whyframe/vue'
import { DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'
import matter from 'gray-matter'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig as viteConfig } from 'vite'
// @ts-ignore TS comes with a Object.groupBy declaration but not a polyfill
import groupBy from 'object.groupby'

import { hoistUseStatements } from '../dev-utilities/hoistUseStatements'
import { kumaIndexHtmlVars } from '../vite.plugins'
import { sync as globSync } from 'glob'
import fs from 'node:fs'

// temporary Object.groupBy polyfill
// TODO(jc): delete this once we get to 2026
groupBy.shim()

const md = markdown(
  {
    html: true,
  },
)

const h1re = /^#+\s+.+/

const get = (path: string) => {
  const items = globSync(path)
    .map((path) => ({ path, content: fs.readFileSync(path).toString() }))
    .map(({ path, content }) => ({ path, ...matter(content) }))
    .map(item => {
      // if there is no frontmatter.title then use the h1 for the title
      item.data.title = item.data?.title || (h1re.exec(item.content)?.[0] ?? '').replace('# ', '')
      return item
    })
  items.reverse()
  return items
}

const files = get('{src,docs}/**/*.md')
const sections = Object.groupBy(files.filter(({ data }) => typeof data.section !== 'undefined'), (item) => {
  return item.data.section
})
const components = files.filter((item) => {
  // we default to type: component seeing as thats the thing we will use docs for most
  return item.data.type === 'component' || (typeof item.data.type === 'undefined' && typeof item.data.section === 'undefined')
})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kuma-gui',
  description: '',
  vite: viteConfig({
    plugins: [
      {
        // in lieu of being able to provide our own index.html insert `{{.}}`
        // into the html first, so that the following kumaIndexHtmlVars plugin
        // works the same
        name: 'kuma-vitepress-gotemplate',
        transformIndexHtml: (template) => {
          return template.replace('<div id="app"></div>', `<div id="app"></div><script type="application/json" id="kuma-config" />{{.}}</script>`)
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
                const str = md.render(data)
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
  cleanUrls: true,
  ignoreDeadLinks: [
    // ignore all localhost links
    /^https?:\/\/localhost/,
  ],
  themeConfig: {
    sidebar: [
      ...Object.entries(sections).map(([key, value]) => {
        return {
          collapsed: key !== 'Overview',
          text: key,
          items: value?.map(item => {
            const items = get(`${path.dirname(item.path)}/*/**/README.md`)
            return {
              collapsed: true,
              text: item.data.title,
              link: item.path,
              items: items.map((i) => {
                return {
                  text: i.data.title,
                  link: i.path
                }
              })
            }
          }) ?? []
        }
      }),
      {
        text: 'Component Index',
        collapsed: false,
        items: components.map((item) => {
          return {
            text: item.data.title,
            link: item.path,
          }
        })
      }
    ],
  }
})
