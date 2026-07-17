import { createFetch } from './index'
import type { Dependencies, FS } from './index'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

type PluginOptions<TDependencies extends object = {}> = {
  fs: FS<TDependencies>
  dependencies: Dependencies<TDependencies>
}
const Cookie = {
  parse: (str: string, { prefix = '' } = { prefix: '' }) => {
    return Object.fromEntries(str.split(';')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => {
        const [key, ...value] = item.split('=')
        return [key, value.join('=')] as [string, string]
      })
      .filter(([key, value]) => key.startsWith(prefix)))
  },
}

export default <TDependencies extends object = {}>(opts: PluginOptions<TDependencies>): Plugin => {

  const server = async (server: PreviewServer | ViteDevServer) => {
    const { fs, dependencies } = opts

    const add = server.httpServer?.address() ?? ''
    const address = {
      address: 'localhost',
      port: typeof add === 'string' ? server.config.server.port : add.port,
    }

    const baseUrl = `http://${address.address}:${address.port}`
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
        const response = await fetch(`${baseUrl}${req.url ?? ''}`, {
          method: req.method,
          headers,
        })
        const type = response.headers.get('Content-Type') ?? 'application/json'
        res.setHeader('Content-Type', type)
        res.setHeader('Status-Code', response.headers.get('Status-Code') ?? '200')
        res.statusCode = parseInt(`${res.getHeader('Status-Code')}`)
        const resp = type.endsWith('/json') ? JSON.stringify((await response.json()), null, 4) : (await response.text())

        const cookies = Cookie.parse(req.headers?.cookie ?? '', { prefix: 'KUMA_' })
        if (cookies.KUMA_LATENCY) {
          await new Promise((resolve) => setTimeout(resolve, parseInt(cookies.KUMA_LATENCY)))
        }

        if(response.headers.get('Transfer-Encoding') === 'chunked') {
          res.write(resp)
          res.end()
        } else {
          res.end(resp)
        }
      } catch (e) {
        if (e instanceof Error && e.message.endsWith('not found')) {
          next()
        } else {
          throw e
        }
      }
    })
  }
  return {
    name: 'fake-api',
    configureServer: server,
    configurePreviewServer: server,
  }
}
