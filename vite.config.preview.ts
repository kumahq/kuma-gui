import { readFile as read } from 'fs/promises'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'

const url = process.env.KUMA_GUI_BASE_URL || '/gui'
const api = process.env.KUMA_API_URL || 'http://localhost:5681'
const path = process.env.KUMA_GUI_INDEX || 'dist/gui/index.html'
const port = parseInt(process.env.KUMA_GUI_PORT || '5681')
const index = fileURLToPath(new URL(`./${path}`, import.meta.url))
const pakage = fileURLToPath(new URL('./package.json', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'renderIndexHTML',
      configurePreviewServer: async (server) => {
        const template = (await read(index)).toString()
        const version = JSON.parse((await read(pakage)).toString()).version
        const body = template
          .replace('{{.BaseGuiPath}}', url)
          .replace('{{.}}', JSON.stringify(
            {
              baseGuiPath: url,
              apiUrl: api,
              version,
            },
          ))
        server.middlewares.use('/', (req, res, next) => {
          if (req.originalUrl === `${url}/`) {
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
