import { readFile as read, stat } from 'fs/promises'
import { fileURLToPath, URL } from 'url'
import { defineConfig, createLogger } from 'vite'

const root = fileURLToPath(new URL(process.env.KUMA_GUI_DIST_ROOT || './dist', import.meta.url))
const base = process.env.KUMA_GUI_BASE_URL || '/gui'
const api = process.env.KUMA_API_URL || 'http://localhost:5681'
const port = parseInt(process.env.KUMA_GUI_PORT || '5681')
const pakage = fileURLToPath(new URL('./package.json', import.meta.url))

// https://vitejs.dev/config/
const exists = async (path: string) => {
  try {
    return (await stat(path)).isFile()
  } catch (e) {
    return false
  }
}
const logger = createLogger('info', {})
export default defineConfig({
  plugins: [
    {
      name: 'renderIndexHTML',
      configurePreviewServer: async (server) => {
        const version = JSON.parse((await read(pakage)).toString()).version
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
})
