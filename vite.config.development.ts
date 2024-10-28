import { readFileSync as read } from 'node:fs'
import { defineConfig, mergeConfig } from 'vite'

import { config as prodConfig } from './vite.config.production'
import type { UserConfigFn, UserConfig, Plugin } from 'vite'

export const kumaIndexHtmlVars = (): Plugin => {
  const pack = JSON.parse(read('./package.json').toString())
  return {
    // replace the `{{.}}` with dev vars
    // reproducing what the kuma binary does
    name: 'kuma-index-html-vars',
    transformIndexHtml: (template) => {
      return template
        .replace('{{.BaseGuiPath}}', '/gui')
        .replace('{{.}}', JSON.stringify({
          ...pack.kuma,
          version: pack.version,
        }),
        )
    },

  }
}

// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    {
      plugins: [
        kumaIndexHtmlVars(),
      ],
    } satisfies UserConfig,
  )
}
export default defineConfig(config)
