import { readFile as read, stat } from 'fs/promises'
import { fileURLToPath, URL } from 'url'
import { defineConfig, createLogger } from 'vite'

import type { UserConfigFn } from 'vite'

// https://vitejs.dev/config/
const exists = async (path: string) => {
  try {
    return (await stat(path)).isFile()
  } catch (e) {
    return false
  }
}
const logger = createLogger('info', {})

export const context = (url: string) => ({
  root: fileURLToPath(new URL(process.env.KUMA_GUI_DIST_ROOT || './dist', url)),
  base: process.env.KUMA_GUI_BASE_URL || '/gui',
  api: process.env.KUMA_API_URL || 'http://localhost:5681',
  port: parseInt(process.env.KUMA_GUI_PORT || '5681'),
  module: fileURLToPath(new URL('./package.json', url)),
})
export type PreviewConfigContext = ReturnType<typeof context>

export const config: (context: PreviewConfigContext) => UserConfigFn = ({
  root,
  base,
  api,
  port,
  module,
}) => () => {
  return {
    plugins: [
      {
        name: 'renderIndexHTML',
        configurePreviewServer: async (server) => {
          const version = JSON.parse((await read(module)).toString()).version
          const index = `${root}${base}/index.html`
          logger.info(`Serving: ${index} as index.html`)
          const template = (await read(index)).toString()
          const body = template
            .replace('{{.BaseGuiPath}}', base)
            .replace('{{.}}', JSON.stringify(
              {
                baseGuiPath: base,
                apiUrl: api,
                version,
                product: 'Kuma',
                mode: 'global',
                environment: 'universal',
                apiReadOnly: false,
              },
            ))
          server.middlewares.use('/', async (req, res, next) => {
            if ((req.originalUrl || '').startsWith(base) && !await exists(`${root}${req.originalUrl}`)) {
              res.end(body)
            } else {
              next()
            }
          })
        },
      },
    ],
    preview: {
      port,
    },
  }
}
export default defineConfig(config(context(import.meta.url)))
