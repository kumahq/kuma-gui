import { token, createInjections } from '@kumahq/container'
import { mocker } from '@kumahq/fake-api/cypress'
import env from '@kumahq/settings/env'

import type { EndpointDependencies } from '@/test-support'
import { dependencies } from '@/test-support'
import getClient from '@/test-support/client'
import type { ServiceDefinition } from '@kumahq/container'
import type { Middleware, Options } from '@kumahq/fake-api'

// temporary intercept returning Mocker
type Mocker = (route: string, opts?: Options, cb?: Middleware) => ReturnType<typeof cy['intercept']>
const $ = {
  env: token<typeof env>('cypress.env'),
  vars: token('cypress.env.vars'),

  mock: token<Mocker>('cypress.mocker'),
  client: token<ReturnType<typeof getClient>>('cypress.client'),
  dependencies: token<EndpointDependencies>('cyporess.fake-api.dependencies'),
}
type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [token('cypress.env.vars'), {
    service: () => {
      // these are only fed to the mocks
      return {
        KUMA_API_URL: () => Cypress.env('VITE_KUMA_API_SERVER_URL'),
        KUMA_VERSION_URL: () => Cypress.env('VITE_VERSION_URL'),
      }
    },
    labels: [
      app.vars,
    ],
  }],

  [app.env, {
    service: env,
    arguments: [
      app.vars,
    ],
  }],

  [$.dependencies, {
    service: (env) => {
      return {
        ...dependencies,
        env,
      }
    },
    arguments: [
      app.env,
    ],
  }],

  [$.client, {
    service: getClient,
  }],
  [app.mock, {
    service: mocker,
    arguments: [
      $.dependencies,
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
export const [
  useMock,
  useClient,
] = createInjections($.mock, $.client)
