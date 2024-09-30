import { readFileSync as read } from 'node:fs'
import { defineConfig, mergeConfig, type UserConfigFn, type UserConfig } from 'vite'

import { config as prodConfig } from './vite.config.production'
const version = JSON.parse(read('./package.json').toString()).version
// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    {
      plugins: [
        {
          // replace the `{{.}}` with dev vars
          // reproducing what the kuma binary does
          name: 'kuma-index-html-vars',
          transformIndexHtml: (template) => {
            return template
              .replace('{{.BaseGuiPath}}', '/gui')
              .replace('{{.}}', JSON.stringify({
                baseGuiPath: '/gui',
                apiUrl: 'http://localhost:5681',
                version,
                product: 'Kuma',
                mode: 'global',
                environment: 'universal',
                storeType: 'postgres',
                apiReadOnly: false,
              }),
              )
          },
        },
      ],
    } satisfies UserConfig,
  )
}
export default defineConfig(config)
