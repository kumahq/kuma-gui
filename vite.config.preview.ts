import { readFile as read, stat } from 'fs/promises'
import { fileURLToPath, URL } from 'url'
import { defineConfig, createLogger } from 'vite'

import type { getPathConfigDefault } from '@/services/env/Env'
import type { UserConfigFn } from 'vite'

type PathConfig = ReturnType<typeof getPathConfigDefault>

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
          server.middlewares.use('/', async (req, res, next) => {
            const cookies = (req.headers?.cookie ?? '').split(';')
              .map((item) => item.trim())
              .filter((item) => item !== '')
              .reduce((prev, item) => {
                const [key, value] = item.split('=')
                prev[key] = value
                return prev
              }, {} as Record<string, string>)

            const body = template
              .replace('{{.BaseGuiPath}}', base)
              .replace('{{.}}', JSON.stringify(
                ((config: PathConfig) => config)(
                  {
                    baseGuiPath: base,
                    apiUrl: api,
                    version,
                    product: 'Kuma',
                    mode: cookies.KUMA_MODE ?? 'global',
                    environment: cookies.KUMA_ENVIRONMENT ?? 'universal',
                    storeType: cookies.KUMA_STORE_TYPE ?? 'postgres',
                    apiReadOnly: false,
                  },
                ),
              ))
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
