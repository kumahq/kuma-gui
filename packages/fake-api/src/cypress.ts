import { createMerge, Router } from './index.ts'
import type { Callback, Dependencies, FS, Mocker } from './index.ts'

type Server = typeof cy

type HistoryEntry = {
  url: URL
  request: {
    method: string
    body: Record<string, unknown>
  }
}
type Client = { request: (request: HistoryEntry ) => void }

const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Callback = (_merge, _req, response) => response

export const mocker = <TClient extends Client, TDependencies extends object = {}>(
  cy: Server,
  fs: FS,
  client: TClient,
  dependencies: Dependencies<TDependencies>,
): Mocker => {
  const router = new Router(fs)
  return (path, opts = {}, cb = noop) => {
    // if path is `*` then that means mock everything, which currently means
    // changing to `/`
    path = path === '*' ? '/' : path
    const baseUrl = dependencies.env('KUMA_API_URL')
    return cy.intercept(
      {
        url: new RegExp(`${baseUrl}${path.replace(reEscape, '\\$&')}`),
      },
      (req) => {
        try {
          const mockEnv = (key: string, d = '') => {
            if (typeof opts[key] !== 'undefined') {
              return opts[key]
            }
            return dependencies.env(key, d)
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
          // once the response has been rendered but not sent resolve any
          // waiting request assertions this means that any mocking done after
          // awaiting the request will happen on the subsequent request not this
          // one
          client.request({
            url,
            request,
          })
          if (typeof response === 'undefined') {
            req.continue()
            return
          }
          req.reply({
            statusCode: parseInt(response.headers?.['Status-Code'] ?? '200'),
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
