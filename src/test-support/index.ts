import deepmerge from 'deepmerge'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import type { MockResponse, FS, AEnv, AppEnvKeys, MockEnvKeys } from '@/test-support/fake'
import { dependencies, escapeRoute } from '@/test-support/fake'
import type { ArrayMergeOptions } from 'deepmerge'
import type { RestRequest } from 'msw'

type Merge = (obj: Partial<MockResponse>) => MockResponse
type Callback = (merge: Merge, req: RestRequest, response: MockResponse) => MockResponse
type Options = Record<string, string>
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
const createMerge = (response: MockResponse): Merge => (obj) => deepmerge(response, obj, { arrayMerge: combineMerge })
export const mocker = (env: AEnv, server: Server, fs: FS) => {
  const baseUrl = env('KUMA_API_URL')

  return (route: string, opts: Options, cb: Callback = noop) => {
    // Temporarily set a seed for all test mocks
    // if (typeof opts.FAKE_SEED !== 'undefined') {
    dependencies.fake.seed(parseInt('1'))
    // }
    const endpoint = fs[route]
    return server.use(
      rest.all(`${baseUrl}${escapeRoute(route)}`, async (req, res, ctx) => {
        const fetch = endpoint({
          ...dependencies,
          env: (key, d = '') => (opts[key as MockEnvKeys] ?? '') || env(key as AppEnvKeys, d),
        })
        const _response = fetch(req)
        const response = cb(createMerge(_response), req, _response)
        return res(
          ctx.status(parseInt(response.headers['Status-Code'] ?? '200')),
          ctx.json(response.body),
        )
      }),
    )
  }
}
export type Mocker = ReturnType<typeof mocker>
