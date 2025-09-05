import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import matter from 'gray-matter'
import path from 'node:path'
// @ts-ignore TS comes with a Object.groupBy declaration but not a polyfill
import groupBy from 'object.groupby'
import { sync as globSync } from 'glob'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// temporary Object.groupBy polyfill
// TODO(jc): delete this once we get to 2026
groupBy.shim()


const h1re = /#+\s+.+/

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
const directives = files.filter((item) => {
  return item.data.type === 'directive'
})
const components = files.filter((item) => {
  // we default to type: component seeing as thats the thing we will use docs for most
  return item.data.type === 'component' || (typeof item.data.type === 'undefined' && typeof item.data.section === 'undefined')
})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kuma-gui',
  description: '',
  vite: {
    configFile: fileURLToPath(new URL('./vite.config.ts', import.meta.url))
  },
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
        text: 'Directive Index',
        collapsed: false,
        items: directives.map((item) => {
          return {
            text: item.data.title,
            link: item.path,
          }
        })
      },
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
