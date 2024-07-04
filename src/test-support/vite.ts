import { URLPattern } from 'urlpattern-polyfill'

import { dependencies } from './fake'
import type { FS } from './fake'
import type { Plugin } from 'vite'

class Router<T> {
  routes: Map<URLPattern, T> = new Map()
  constructor(routes: Record<string, T>) {
    Object.entries(routes).forEach(([key, value]) => {
      if (key.includes('://')) {
        return
      }
      this.routes.set(new URLPattern({
        pathname: key.replace('+', '\\+'),
      }), value)
    })
  }

  match(path: string) {
    for (const [pattern, route] of this.routes) {
      const _url = `data:${path}`
      if (pattern.test(_url)) {
        const args = pattern.exec(_url)
        const params = args?.pathname.groups || {}
        return {
          route,
          params: Object.entries(params).reduce((prev: Record<string, string>, [key, value]) => {
            prev[key] = value || ''
            return prev
          }, {}),
        }
      }
    }
    throw new Error(`Matching route for '${path}' not found`)
  }
}
const strToEnv = (str: string): [string, string][] => {
  return str.split(';')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => {
      const [key, ...value] = item.split('=')
      return [key, value.join('=')] as [string, string]
    })
}

type PluginOptions = {
  fs: FS
  env?: <T extends string>(key: T, d?: string) => string
}
type FetchOptions = {
  method?: string
  body?: Record<string, string>
  headers?: Record<string, string | string[] | undefined>
}

export default (opts: PluginOptions): Plugin => {
  const router = new Router(opts.fs)
  const fetch = async (url: string, options: FetchOptions) => {
    const cookies = strToEnv(String(options.headers?.cookie ?? '')).reduce((prev, [key, value]) => {
      prev[key] = value
      return prev
    }, {} as Record<string, string>)

    const _url = new URL(url)
    const { route, params } = router.match(_url.pathname)

    const env = <T extends Parameters<typeof dependencies['env']>[0]>(key: T, d = '') => dependencies.env(key, cookies[key] ?? d)

    const request = route({
      ...dependencies,
      env,
    })
    const response = request({
      url: _url,
      method: options.method ?? 'GET',
      body: options.body ?? {},
      params,
    })
    await new Promise(resolve => setTimeout(resolve, parseInt(env('KUMA_LATENCY', '0'))))
    return {
      json: async () => {
        return response.body
      },
      text: async () => {
        return response.body.toString()
      },
      headers: new Map(Object.entries(response.headers)),
    }
  }

  return {
    name: 'fake-api',
    configureServer: async (server) => {
      server.middlewares.use(async (req, res, next) => {
        try {
          const response = await fetch(`http://${server.config.server.host}:${server.config.server.port}${req.url ?? ''}`, {
            method: req.method,
            headers: req.headers,
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
