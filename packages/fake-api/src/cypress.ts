import deepmerge from 'deepmerge'
import { URLPattern } from 'urlpattern-polyfill'

import type { ArrayMergeOptions } from 'deepmerge'

export type Options = Record<string, string>
export type Mocker = (route: string, opts: Options, cb: Callback) => void

export type RestRequest = {
  method: string
  params: Record<string, string | readonly string[]>
  body: Record<string, any>
  url: {
    searchParams: URLSearchParams
  }
}

export type MockResponse = {
  headers?: Record<string, string>
  body: string | Record<string, unknown>
} | undefined
export type MockResponder = (req: RestRequest) => MockResponse

export type Dependencies<TDependencies extends object = {}> = {
  env: <T extends string>(key: T, d?: string) => string
} & TDependencies
export type MockEndpoint<TDependencies extends object = {}> = <TArgs extends Dependencies<TDependencies>>(args: TArgs) => MockResponder
export type FS<TDependencies extends object = {}> = Record<string, MockEndpoint<TDependencies>>
export type Merge = (obj: Partial<MockResponse>) => MockResponse
export type Callback = (merge: Merge, req: RestRequest, response: MockResponse) => MockResponse

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

// merges objects in array positions rather than replacing
const combineMerge = (target: object[], source: object[], options: ArrayMergeOptions): object[] => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}


export const undefinedSymbol = Symbol('undefined')
export const createMerge = (response: MockResponse): Merge => (obj) => {
  const merged = deepmerge(response, obj, { arrayMerge: combineMerge })
  return JSON.parse(JSON.stringify(merged, (_key, value) => {
    if (value === undefinedSymbol) {
      return
    }
    return value
  }))
}

const reEscape = /[/\-\\^$*+?.()|[\]{}]/g
const noop: Callback = (_merge, _req, response) => response

type AppEnvKeys = string
type MockEnvKeys = string
type Env = (key: AppEnvKeys | MockEnvKeys, d: string) => string
type HistoryEntry = {
  url: URL
  request: {
    method: string
    body: Record<string, unknown>
  }
}
type Client = { request: (request: HistoryEntry ) => void }

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
          const mockEnv: Env = (key, d = '') => {
            if (typeof opts[key as MockEnvKeys] !== 'undefined') {
              return opts[key as MockEnvKeys]
            }
            // return env(key as AppEnvKeys, d)
            return dependencies.env(key as AppEnvKeys, d)
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
