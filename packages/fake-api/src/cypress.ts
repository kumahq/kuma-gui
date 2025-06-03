import { createFetchSync } from './index'
import type { Middleware, Dependencies, FS, Mocker } from './index'

const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Middleware = (_req, response) => response

export const mocker = <T extends object = {}>(
  dependencies: Dependencies<T>,
  fs: FS,
): Mocker => {


  return (path, opts = {}, middleware = noop) => {
    const env = dependencies.env
    dependencies.env = <T extends Parameters<typeof env>[0]>(key: T, d = '') => {
      return env(key, opts[key] ?? d)
    }
    const baseUrl = dependencies.env('KUMA_API_URL')
    const _fs = Object.fromEntries(Object.entries(fs).map(([route, response]) => {
      return [route.includes('://') ? route : `${baseUrl}${route}`, response]
    }))
    const fetch = createFetchSync({
      dependencies,
      fs: _fs,
    })
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    path = path === '*' ? '/' : path
    return cy.intercept(
      {
        url: new RegExp(`${baseUrl}${path.replace(reEscape, '\\$&')}`),
      },
      (req) => {
        try {
          // headers can be string | string[], not string
          const headers = Object.entries(req.headers).reduce((prev, [key, item]) => {
            if (typeof item !== 'undefined') {
              prev[key] = Array.isArray(item) ? item[0] : item
            }
            return prev
          }, {} as Record<string, string>)

          const resp = fetch(req.url, {
            method: req.method,
            headers,
            body: req.body,
          })
          const type = resp.headers.get('Content-Type') ?? 'application/json'

          const response = middleware({
            url: new URL(req.url),
            method: req.method,
            body: req.body,
            params: {},
          }, {
            headers: Object.fromEntries(resp.headers.entries()),
            body: type.endsWith('/json') ? resp.json() : resp.text(),
          })

          if (typeof response === 'undefined') {
            req.continue()
            return
          }

          req.reply({
            contentType: type,
            statusCode: parseInt(response.headers?.['Status-Code'] ?? '200'),
            delay: parseInt(dependencies.env('KUMA_LATENCY', opts['KUMA_LATENCY'] ?? '0')),
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
