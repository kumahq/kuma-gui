import deepmerge from 'deepmerge'
import { http, HttpResponse } from 'msw'

import { dependencies, escapeRoute } from './fake'
import type { FakeEndpoint, MockResponse, FS, AEnv, Env, AppEnvKeys, MockEnvKeys, RestRequest } from './fake'
import type { ArrayMergeOptions } from 'deepmerge'

export type { FS, EndpointDependencies, MockResponder } from './fake'

export type Merge = (obj: Partial<MockResponse>) => MockResponse
export type Callback = (merge: Merge, req: RestRequest, response: MockResponse) => MockResponse
export type Options = Record<string, string>

export const undefinedSymbol = Symbol('undefined')

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

const noop: Callback = (_merge, _req, response) => response
export const createMerge = (response: MockResponse): Merge => (obj) => {
  const merged = deepmerge(response, obj, { arrayMerge: combineMerge })
  return JSON.parse(JSON.stringify(merged, (_key, value) => {
    if (value === undefinedSymbol) {
      return
    }
    return value
  }))
}

export const useResponder = (fs: FS, env: AEnv) => {
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
export const server = (mock: FakeEndpoint, options: {
  env?: Record<AppEnvKeys, string>
  params?: Record<string, string>
}) => {
  return async (env: Record<string, string>) => {
    const responder = useResponder({
      _: mock,
    }, (key: AppEnvKeys, d = '') => env[key] ?? d)
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
    )).body
  }
}

export const handler = (fs: FS, env: AEnv) => {
  const baseUrl = env('KUMA_API_URL')
  const responder = useResponder(fs, env)
  return (route: string) => {
    const respond = responder(route)
    return http.all(`${route.includes('://') ? '' : baseUrl}${escapeRoute(route)}`, async ({ request, params }) => {
      const response = await respond({
        method: request.method,
        url: new URL(request.url),
        body: request.body,
        params,
      })
      return HttpResponse.json(response.body, {
        status: parseInt(response.headers['Status-Code'] ?? '200'),
      })
    })
  }
}
export const mswHandlers = (env: AEnv, fs: FS) => {
  const handlerFor = handler(fs, env)
  return Object.keys(fs).map(route => {
    return handlerFor(route)
  })
}
export type Mocker = (route: string, opts: Options, cb: Callback) => void
