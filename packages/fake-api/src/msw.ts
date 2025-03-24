import { http, HttpResponse, passthrough } from 'msw'

import { createMerge } from './lib/utils.js'
import type { Callback, Dependencies, FS, MockEndpoint, MockResponse, Options, RestRequest } from './lib/utils.js'

type AppEnvKeys = string
type MockEnvKeys = string
type Env = (key: AppEnvKeys, d?: string) => string
type AEnv = (key: AppEnvKeys | MockEnvKeys, d?: string) => string

function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}

const noop: Callback = (_merge, _req, response) => response

export const useResponder = <TDependencies extends object = {}>(fs: FS, env: AEnv, dependencies: Dependencies<TDependencies>) => {
  return (route: string, opts: Options = {}, cb: Callback = noop) => {
    const mockEnv: Env = (key, d = '') => (opts[key as MockEnvKeys] ?? '') || env(key as AppEnvKeys, d)
    if (route !== '*') {
      dependencies.fake.seed(typeof opts.FAKE_SEED !== 'undefined' ? parseInt(typeof opts.FAKE_SEED) : 1)
    }
    const endpoint = fs[route]
    const fetch = endpoint({
      ...dependencies,
      env: mockEnv,
    })
    return async (req: RestRequest): Promise<MockResponse> => {
      const _response = fetch(req)
      const latency = parseInt(mockEnv('KUMA_LATENCY', '0'))
      if (latency !== 0) {
        await new Promise(resolve => setTimeout(resolve, latency))
      }
      return cb(createMerge(_response), req, _response)
    }
  }
}
export const server = <TDependencies extends object = {}>(mock: MockEndpoint<TDependencies>, options: {
  env?: Record<AppEnvKeys, string>
  params?: Record<string, string>
}, dependencies: Dependencies<TDependencies>) => {
  return async (env: Record<string, string>) => {
    const responder = useResponder({
      _: mock,
    },(key: AppEnvKeys, d = '') => env[key] ?? d, dependencies)
    const request = responder('_')
    return (await request(
      {
        method: 'GET',
        body: {},
        url: {
          searchParams: new URLSearchParams(),
        },
        params: options.params ?? {},
      },
    ))?.body
  }
}

export const handler = <TDependencies extends object = {}>(fs: FS, env: AEnv, dependencies: Dependencies<TDependencies>) => {
  const baseUrl = env('KUMA_API_URL')
  const responder = useResponder(fs, env, dependencies)
  return (route: string) => {
    const respond = responder(route)
    const base = route.includes('://') ? '' : baseUrl
    if (route.startsWith('://')) {
      route = route.replace('://', '')
    }
    return http.all(`${base}${escapeRoute(route)}`, async ({ request, params }) => {
      const response = await respond({
        method: request.method,
        url: new URL(request.url),
        body: request.body ? JSON.parse(await new Response(request.body).text() || '{}') : {},
        params: Object.fromEntries(
          Object.entries(params).filter(
            (entry): entry is [string, string | readonly string[]] => typeof entry[1] !== 'undefined',
          ),
        ),
      })

      if (typeof response === 'undefined') {
        return passthrough()
      }

      return HttpResponse.json(response.body, {
        status: parseInt(response.headers?.['Status-Code'] ?? '200'),
      })
    })
  }
}
export const mswHandlers = <TDependencies extends object = {}>(env: AEnv, fs: FS, dependencies: Dependencies<TDependencies>) => {
  const handlerFor = handler(fs, env, dependencies)
  return Object.keys(fs).map(route => {
    return handlerFor(route)
  })
}
