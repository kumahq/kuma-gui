import { afterAll, afterEach, beforeAll, beforeEach, jest } from '@jest/globals'
// Polyfills `window.fetch` for Jest because it runs in a Node environment where fetch isn’t available. It initially looked like this would change with Node.js 18, but that is not so.
import 'isomorphic-fetch'
import { config } from '@vue/test-utils'

import { TOKENS as COMPONENT_TOKENS } from '../src/components'
import { TOKENS as TEST, services as testing, useServer } from '../src/services/testing'
import { services as onboarding } from '@/app/onboarding'
import { TOKENS as DEV, services as development } from '@/services/development'
import CliEnv from '@/services/env/CliEnv'
import { TOKENS as PROD, services as production } from '@/services/production'
import { get, container, build, token } from '@/services/utils'

export { useMock } from '../src/services/testing'
// jest can't import this module properly due to transpiling issues
// mock this out with a blank element
jest.mock('vue-github-button', () => ({ template: '<span />' }))
//

const $ = {
  ...PROD,
  ...DEV,
  ...TEST,
};

(async () => {
  build(
    production($),
    onboarding({
      ...$,
      routes: $.routesLabel,
    }),

    development($),
    testing($),
  )

  /**
  * Adds the application’s router to vue test utils. This way tests don’t have to set-up a new router instance on their own.
  */
  config.global.plugins.push(get($.router))

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

  const server = useServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
})()

export const withVersion = (v: string) => {
  class TestEnv extends CliEnv {
    var(...rest: Parameters<CliEnv['var']>) {
      const key = rest[0]
      if (key === 'KUMA_VERSION') {
        return v
      }
      return super.var(...rest)
    }
  }
  build(
    [
      [$.Env, {
        service: TestEnv,
        arguments: [$.EnvVars],
      }],
    ],
  )
}
export const withSources = (sources: any) => {
  build(
    [
      [token('sources'), {
        service: sources,
        arguments: [$.httpClient],
        labels: [
          $.sources,
        ],
      }],
    ],
  )
}
