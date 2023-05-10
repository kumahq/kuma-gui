import deepmerge from 'deepmerge'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { dependencies, escapeRoute } from './fake'
import type { MockResponse, FS, AEnv, Env, AppEnvKeys, MockEnvKeys, RestRequest } from './fake'
import type { ArrayMergeOptions } from 'deepmerge'

export type { FS, EndpointDependencies, MockResponder } from './fake'

export type Merge = (obj: Partial<MockResponse>) => MockResponse
export type Callback = (merge: Merge, req: RestRequest, response: MockResponse) => MockResponse
export type Options = Record<string, string>
type Server = ReturnType<typeof setupServer>

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
export const createMerge = (response: MockResponse): Merge => (obj) => deepmerge(response, obj, { arrayMerge: combineMerge })

const useResponder = <T extends RestRequest>(fs: FS, env: AEnv) => {
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
    return async (req: T): Promise<MockResponse> => {
      const _response = fetch(req)
      await new Promise(resolve => setTimeout(resolve, parseInt(mockEnv('KUMA_LATENCY', '0'))))
      return cb(createMerge(_response), req, _response)
    }
  }
}
export const handler = (fs: FS, env: AEnv) => {
  const baseUrl = env('KUMA_API_URL')
  const responder = useResponder<RestRequest>(fs, env)
  return (route: string, opts: Options = {}, cb: Callback = noop) => {
    const respond = responder(route, opts, cb)
    return rest.all(`${route.includes('://') ? '' : baseUrl}${escapeRoute(route)}`, async (req, res, ctx) => {
      const response = await respond(req)
      return res(
        ctx.status(parseInt(response.headers['Status-Code'] ?? '200')),
        ctx.json(response.body),
      )
    })
  }
}
export const fakeApi = (env: AEnv, fs: FS) => {
  const handlerFor = handler(fs, env)

  return (route: string, _opts: Options = {}, _cb: Callback = noop) => {
    if (route === '*') {
      return Object.entries(fs).map(([route, _endpoint]) => {
        return handlerFor(route)
      })
    } else {
      return []
    }
  }
}
export const mocker = (env: AEnv, server: Server, fs: FS) => {
  const handlerFor = handler(fs, env)

  return (route: string, opts: Options = {}, cb: Callback = noop) => {
    return server.use(
      handlerFor(route, opts, cb),
    )
  }
}
export type Mocker = ReturnType<typeof mocker>
