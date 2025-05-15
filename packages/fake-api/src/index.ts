import { URLPattern } from 'urlpattern-polyfill'

export type RestRequest = {
  method: string
  params: Record<string, string | readonly string[]>
  body: Record<string, any>
  url: URL
}

export type MockResponse = {
  headers?: Record<string, string>
  body: string | Record<string, unknown>
} | undefined

export type MockResponder = (req: RestRequest) => MockResponse

export type Middleware = (request: RestRequest, response: MockResponse) => MockResponse
export type Options = Record<string, string>
export type Mocker = (route: string, opts: Options, cb: Middleware) => void

export type Dependencies<TDependencies extends object = {}, TFake extends object = {}> = {
  env: <T extends string>(key: T, d?: string) => string
  fake: { seed: (s: number) => void } & TFake
} & TDependencies
export type MockEndpoint<TDependencies extends object = {}> = <TArgs extends Dependencies<TDependencies>>(args: TArgs) => MockResponder
export type FS<TDependencies extends object = {}> = Record<string, MockEndpoint<TDependencies>>

export function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}


export class Router<T> {
  routes: Map<URLPattern, T> = new Map()
  constructor(routes: Record<string, T>) {
    Object.entries(routes).forEach(([key, value]) => {
      this.routes.set(new URLPattern(key), value)
    })
  }

  match(path: string) {
    for (const [pattern, route] of this.routes) {
      if (pattern.test(path)) {
        const args = pattern.exec(path)
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
export const createFetchSync = <T extends object = {}>({ dependencies, fs }: { dependencies: Dependencies<T>, fs: FS }) => {
  const router = new Router(fs)
  return (url: string, options: RequestInit & { body?: Record<string, string>, headers?: Record<string, string | string[] | undefined>}) => {

    const _url = new URL(url)
    const { route, params } = router.match(_url.toString())

    const cookies = strToEnv(String(options.headers?.cookie ?? '')).reduce((prev, [key, value]) => {
      prev[key] = value
      return prev
    }, {} as Record<string, string>)
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
    if (typeof response === 'undefined') {
      throw new Error('not found')
    }
    return {
      json: () => {
        return response.body
      },
      text: () => {
        return response.body.toString()
      },
      headers: new Map(Object.entries(response.headers ?? {})),
    }
  }
}
export const createFetchAsync = (...rest: Parameters<typeof createFetchSync>) => {
  const fetch = createFetchSync(...rest)
  return async (...rest: Parameters<typeof fetch>) => {
    const { json, text, headers } = fetch(...rest)
    return {
      headers,
      json: async (...rest: Parameters<typeof json>) => json(...rest),
      text: async (...rest: Parameters<typeof text>) => text(...rest),
    }
  }
}
export const createFetch = createFetchAsync

