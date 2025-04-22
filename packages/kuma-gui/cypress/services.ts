import { mocker } from '@kumahq/fake-api/cypress'

import type { EnvVars } from '@/app/application/services/env/Env'
import { token, ServiceDefinition, createInjections } from '@/services/utils'
import type { EndpointDependencies } from '@/test-support'
import { dependencies } from '@/test-support'
import getClient from '@/test-support/client'
import type { Callback, Options } from '@kumahq/fake-api'


// this needs to come from testing
const env = (
  env: EnvVars,
) => (key: keyof EnvVars, d = '') => {
  return env[key] || d
}
type AEnv = ReturnType<typeof env>
// temporary intercept returning Mocker
type Mocker = (route: string, opts?: Options, cb?: Callback) => ReturnType<typeof cy['intercept']>
const $ = {
  EnvVars: token<EnvVars>('EnvVars'),
  env: token<AEnv>('env'),

  cy: token<typeof cy>('cy'),
  mockServer: token('mockServer'),
  mock: token<Mocker>('mocker'),
  Env: token('Env'),
  client: token<ReturnType<typeof getClient>>('client'),
  dependencies: token<EndpointDependencies>('dependencies'),
}
type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [$.EnvVars, {
    constant: {
      KUMA_API_URL: Cypress.env('VITE_KUMA_API_SERVER_URL'),
      KUMA_VERSION_URL: Cypress.env('VITE_VERSION_URL'),
      KUMA_DOCS_URL: Cypress.env('VITE_DOCS_BASE_URL'),
      KUMA_MOCK_API_ENABLED: Cypress.env('VITE_MOCK_API_ENABLED'),
    },
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

  [app.cy, {
    constant: cy,
  }],
  [$.client, {
    service: getClient,
  }],
  [app.mockServer, {
    service: (mock: Mocker) => {
      mock('*')
    },
    arguments: [
      app.mock,
    ],
  }],
  [app.mock, {
    service: mocker,
    arguments: [
      app.cy,
      app.fakeFS,
      $.client,
      $.dependencies,
    ],
  }],
  // this will eventually come from testing
  [app.env, {
    service: env,
    arguments: [
      $.EnvVars,
    ],
  }],

]
export const TOKENS = $
export const [
  useMock,
  useServer,
  useClient,
] = createInjections($.mock, $.mockServer, $.client)
