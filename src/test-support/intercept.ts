import { URLPattern } from 'urlpattern-polyfill'

import { TOKENS } from '@/services/e2e'
import { get } from '@/services/utils'
import { FS, Callback, createMerge, Mocker } from '@/test-support'
import { dependencies, MockEnvKeys, AppEnvKeys, Env } from '@/test-support/fake'

type Server = typeof cy

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

const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Callback = (_merge, _req, response) => response
export const mocker = (env: (key: AppEnvKeys, d?: string) => string, cy: Server, fs: FS): Mocker => {
  const router = new Router(fs)
  return (path, opts = {}, cb = noop) => {
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    path = path === '*' ? '/' : path
    const baseUrl = env('KUMA_API_URL')
    const client = get(TOKENS.client)
    return cy.intercept(
      {
        url: new RegExp(`${baseUrl}${path.replace(reEscape, '\\$&')}`),
      },
      (req) => {
        try {
          const mockEnv: Env = (key, d = '') => {
            if (typeof opts[key as MockEnvKeys] !== 'undefined') {
              return opts[key as MockEnvKeys]
            }
            return env(key as AppEnvKeys, d)
          }
          const path = req.url.replace(baseUrl, '')
          const { route, params } = router.match(path)
          const endpoint = route
          const fetch = endpoint({
            ...dependencies,
            env: mockEnv,
          })
          const url = new URL(req.url)
          const body = req.body

          const request = {
            method: req.method,
            params,
            body,
            url,
          }
          const _response = fetch(request)
          const response = cb(createMerge(_response), request, _response)
          client.history.push({
            url,
            request,
          })
          req.reply({
            statusCode: parseInt(response.headers['Status-Code'] ?? '200'),
            delay: parseInt(mockEnv('KUMA_LATENCY', '0')),
            body: response.body,
          })
        } catch (e) {
          console.error(e)
          req.continue()
        }
      },
    )
  }
}
