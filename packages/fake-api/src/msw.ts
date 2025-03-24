import { http, HttpResponse, passthrough } from 'msw'

import { createMerge } from './lib/utils.ts'
import type { Callback, Dependencies, FS, MockEndpoint, MockResponse, Options, RestRequest } from './lib/utils.ts'

function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}

const noop: Callback = (_merge, _req, response) => response

export const useResponder = <TDependencies extends object = {}>(fs: FS, dependencies: Dependencies<TDependencies>) => {
  return (route: string, opts: Options = {}, cb: Callback = noop) => {
    const mockEnv = (key: string, d = '') => (opts[key] ?? '') || dependencies.env(key, d)
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
export const server = <TDependencies extends object = {}, TEnvKeys extends string = string>(mock: MockEndpoint<TDependencies>, options: {
  env?: Record<TEnvKeys, string>
  params?: Record<string, string>
}, dependencies: Dependencies<TDependencies>) => {
  return async (env: Record<string, string>) => {
    const responder = useResponder({
      _: mock,
    }, {
      ...dependencies,
      env: (key: keyof typeof env, d = '') => env[key] ?? d,
    })
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

export const handler = <TDependencies extends object = {}>(fs: FS, dependencies: Dependencies<TDependencies>) => {
  const baseUrl = dependencies.env('KUMA_API_URL')
  const responder = useResponder(fs, dependencies)
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
export const mswHandlers = <TDependencies extends object = {}>(fs: FS, dependencies: Dependencies<TDependencies>) => {
  const handlerFor = handler(fs, dependencies)
  return Object.keys(fs).map(route => {
    return handlerFor(route)
  })
}
