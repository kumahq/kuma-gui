// This is the `main`/entrypoint for our CLI unit tests
// When running via vitest this file is added first using
// vitest's `setupFiles` property, please see `/vite.config.production.ts`

import { beforeEach, afterEach, beforeAll } from 'vitest'

import { TOKENS as TEST, services as testing } from './index'
import { TOKENS as COMPONENT_TOKENS } from '../src/components'
import { services as onboarding } from '@/app/onboarding'
import { TOKENS as DEV, services as development } from '@/services/development'
import { TOKENS as PROD, services as production } from '@/services/production'
import { get, container, build, token } from '@/services/utils'

export { useMock } from './index'

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
  // initializes vue-test-utils with any global components and/or plugins etc
  get($.app)

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
  beforeAll(() => (_ = COMPONENT_TOKENS) => {})
  //
  beforeEach(() => container.capture?.())
  afterEach(() => container.restore?.())
})()

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
