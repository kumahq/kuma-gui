import { load, DEFAULT_SCHEMA, Type } from 'js-yaml'
import markdown from 'markdown-it'
import { execSync } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

export const playwrightBdd = (src ='features/**/*.feature'): Plugin => {
  const playwrightBdd = dirname(fileURLToPath(import.meta.resolve('playwright-bdd')))
  return {
    name: 'playwrightBdd',
    configureServer(server) {
      server.watcher.add(src)
      server.watcher.on('change', (path) => {
        if(path.endsWith('.feature')) {
          execSync(`node ${playwrightBdd}/cli/index.js`, { stdio: 'inherit' })
        }
      })
    },
  }
}

export const yamlLoader = (): Plugin => {
  const md = markdown(
    {
      html: true,
    },
  )
  const schema = DEFAULT_SCHEMA.extend(
    new Type('tag:yaml.org,2002:text/markdown', {
      kind: 'scalar',
      construct: (data) => {
        // We only currently use !!text/markdown within yaml for out locales/i18n text
        // for which we use FormatJS under the hood. FormatJS requires you to escape any XML/HTML looking
        // things, plus ICU '{' and '}', hence this replace.
        // If we ever need !!text/markdown for anything else we should do something like !!text/icu+markdown
        const str = md.render(data)

        return str.replace(/</g, "'<'")
          .replace(/%7B/g, '{')
          .replace(/%7D/g, '}')
      },
    }),
  )
  return {
    name: 'yamlLoader',
    transform: async (code, filename) => {
      if (/\.ya?ml$/.test(filename)) {
        const json = load(code, { schema, filename, onWarning: (warning) => console.warn(warning.toString()) })
        return {
          code: `export default ${JSON.stringify(json)};`,
          map: { mappings: '' },
        }
      }
    },
  }
}


export const vuePluginConfig = () => ({
  template: {
    compilerOptions: {
      whitespace: 'preserve' as const,
      isCustomElement: (item: string) => [
        'search',
      ].includes(item),
    },
  },
})
