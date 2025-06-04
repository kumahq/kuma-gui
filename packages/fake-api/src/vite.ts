import { createFetch } from './index'
import type { Dependencies, FS } from './index'
import type { Plugin } from 'vite'

type PluginOptions<TDependencies extends object = {}> = {
  fs: FS<TDependencies>
  dependencies: Dependencies<TDependencies>
}

export default <TDependencies extends object = {}>(opts: PluginOptions<TDependencies>): Plugin => {

  return {
    name: 'fake-api',
    configureServer: async (server) => {
      const { fs, dependencies } = opts
      const baseUrl = `http://${server.config.server.host}:${server.config.server.port}`
      const _fs = Object.fromEntries(Object.entries(fs).map(([route, response]) => {
        return [route.includes('://') ? route : `${baseUrl}${route}`, response]
      }))
      const fetch = createFetch({
        dependencies,
        fs: _fs,
      })
      server.middlewares.use(async (req, res, next) => {
        try {
          // headers can be string | string[] | undefined, not string
          const headers = Object.entries(req.headers).reduce((prev, [key, item]) => {
            if(typeof item !== 'undefined') {
              prev[key] = Array.isArray(item) ? item[0] : item
            }
            return prev
          }, {} as Record<string, string>)

          const response = await fetch(`http://${server.config.server.host}:${server.config.server.port}${req.url ?? ''}`, {
            method: req.method,
            headers,
          })
          const type = response.headers.get('Content-Type') ?? 'application/json'
          res.setHeader('Content-Type', type)
          res.setHeader('Status-Code', response.headers.get('Status-Code') ?? '200')
          res.end(type.endsWith('/json') ? JSON.stringify((await response.json()), null, 4) : (await response.text()))
        } catch (e) {
          if (e instanceof Error && e.message.endsWith('not found')) {
            next()
          } else {
            throw e
          }
        }
      })
    },
  }
}
