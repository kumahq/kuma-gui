import { pathToRegexp } from 'path-to-regexp'

import { createFetchSync } from './index'
import type { Middleware, Dependencies, FS, Mocker } from './index'

const noop: Middleware = (_req, response) => response

const routeToRegexp = (route: string) => {
  const url = new URL(route, !route.includes('://') ? 'http://localhost' : undefined)
  // escape `:`s for pathToRegexp's named segments (/:segment/)
  const origin = url.origin.replaceAll(':', '\\:')
  const { regexp } = pathToRegexp(`${route.includes('://') ? origin : ''}${url.pathname}`)
  // remove the end of pathToRegexps regexp
  // and replace it with optional `/` and optional `?<optional chars>`
  const re = new RegExp(
    regexp.toString().replace('(?:\\/$)?$/i', '(?:\\/)?(\\?.*)?$').substring(1), 'i',
  )
  return re
}
export const mocker = <T extends object = {}>(
  dependencies: Dependencies<T>,
  fs: FS,
): Mocker => {
  return (path, opts = {}, middleware = noop) => {
    const env = dependencies.env
    dependencies.env = <T extends Parameters<typeof env>[0]>(key: T, d = '') => {
      return env(key, opts[key] ?? d)
    }
    const fetch = createFetchSync({
      dependencies,
      fs,
    })
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    return Object.keys(path === '*' ? fs : { [path]: '' }).map(route => {
      return cy.intercept(
        {
          url: routeToRegexp(route),
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
    })
  }
}
