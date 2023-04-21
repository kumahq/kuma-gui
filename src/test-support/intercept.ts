import { URLPattern } from 'urlpattern-polyfill'

import { FS, Callback, createMerge, Mocker } from '@/test-support'
import { dependencies, MockEnvKeys, AppEnvKeys } from '@/test-support/fake'
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
        return { route, params: args?.pathname.groups }
      }
    }
    throw new Error(`Matching route for '${path}' not found`)
  }
}

type Server = typeof cy
const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Callback = (_merge, _req, response) => response
export const mocker = (env: (key: AppEnvKeys) => string, cy: Server, fs: FS): Mocker => {
  const router = new Router(fs)
  return (path, opts = {}, cb = noop) => {
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    path = path === '*' ? '/' : path
    const baseUrl = env('KUMA_API_URL')
    cy.intercept(
      {
        url: new RegExp(`${baseUrl}${path.replace(reEscape, '\\$&')}`),
      },
      (req) => {
        try {
          const url = new URL(req.url)
          const { route, params } = router.match(url.pathname)
          const endpoint = route
          const fetch = endpoint({
            ...dependencies,
            env: (key/*, d = '' */) => (opts[key as MockEnvKeys] ?? '') || env(key as AppEnvKeys),
          })
          const request = {
            params,
            url: {
              searchParams: new URLSearchParams(url.search),
            },
          }
          // @ts-ignore
          const response = fetch(request)
          // @ts-ignore
          req.reply(cb(createMerge(response), request, response).body)
        } catch (e) {
          Cypress.log({ displayName: 'ERROR', message: (e as Error).message })
          req.continue()
        }
      },
    )
  }
}
