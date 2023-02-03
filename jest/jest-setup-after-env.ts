import { afterAll, afterEach, beforeAll, beforeEach, expect, jest } from '@jest/globals'

// Polyfills `window.fetch` for Jest because it runs in a Node environment where fetch isn’t available. It initially looked like this would change with Node.js 18, but that is not so.
import 'isomorphic-fetch'

import { config } from '@vue/test-utils'

import { replaceAttributesSnapshotSerializer } from './jest-replace-attribute-snapshot-serializer'
import { createRouter } from '../src/router/router'
import { TOKENS, get, container, set, injected } from '../src/services'
import { TOKENS as COMPONENT_TOKENS } from '../src/components'
import { setupMockServer } from '../src/api/setupMockServer'
import { rest, MockedRequest as Request } from 'msw'
import Env from '@/services/env/Env'

type MockFunction = (_opts: Record<string, unknown>, cb: (req: Request, resp: Record <string, any>) => Record<string, unknown>) => void

// jest can't import this module properly due to transpiling issues
// mock this out with a blank element
jest.mock('vue-github-button', () => ({ template: '<span />' }))

/**
 * Adds the application’s router to vue test utils. This way tests don’t have to set-up a new router instance on their own.
 */
const router = createRouter(get(TOKENS.routes))
config.global.plugins.push(router)

/**
 * Adds the application’s Vuex store to vue test utils. This way tests don’t have to set-up a new store instance on their own.
 */
config.global.plugins.push([get(TOKENS.store), get(TOKENS.storeKey)])

/**
 * Kongponents uses generated UUIDs for several attribute values.
 * This breaks the project’s snapshot tests since they’re based on fully-mounted components
 * which also includes those from external sources like Kongponents.
 *
 * In order to stabilize the tests which otherwise fail because the attribute values are different every run,
 * we use a custom snapshot serializer to replace those attribute values with one fixed value.
 */
expect.addSnapshotSerializer(replaceAttributesSnapshotSerializer([
  'id',
  'aria-describedby',
  'aria-labelledby',
  'aria-controls',
  'data-tableid',
]))

const server = setupMockServer(import.meta.env.VITE_KUMA_API_SERVER_URL)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// unless we actually use COMPONENT_TOKENS it won't actually get executed
// probably due to tree shaking/rollup import ordering. This mixed with
// container capturing/restoring to make our tests isolated means that
// potentially we can capture an empty container before all the tokens are set,
// then set the TOKENS/fill the container during a test then the container can
// get restored to empty whilst we still have TOKENS with now non-existent
// services accessing TOKENS before we do anything means we set the TOKENS and
// fill the container with the default services i.e. before we capture if we
// ever make a test mocking utility to mock out components (similar to
// withVersion) will will then use COMPONENT_TOKENS here also, which means we
// can remove the following line
beforeAll((_ = COMPONENT_TOKENS) => {})
//
beforeEach(() => container.capture?.())
afterEach(() => container.restore?.())

// add a utility to easily setup/mock out API endpoints
const re = /\+/g

const useMock = (url: string, response: Record<string, unknown>):MockFunction => {
  return (_opts, cb) => {
    server.use(
      rest.get(`${import.meta.env.VITE_KUMA_API_SERVER_URL.slice(0, -1)}${url.replace(re, '\\+')}`, (req, res, ctx) => {
        return res(ctx.json(cb(req, JSON.parse(JSON.stringify(response)))))
      }),
    )
  }
}

export const withVersion = (v: string) => {
  class TestEnv extends Env {
    var(...rest: Parameters<Env['var']>) {
      const key = rest[0]
      if (key === 'KUMA_VERSION') {
        return v
      }
      return super.var(...rest)
    }
  }
  set(TOKENS.Env, TestEnv)
  injected(TestEnv, TOKENS.EnvVars)
}
export { router, server, useMock }
