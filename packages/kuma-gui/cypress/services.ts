import { token, ServiceDefinition, createInjections } from '@kumahq/container'
import { mocker } from '@kumahq/fake-api/cypress'

import type { EndpointDependencies } from '@/test-support'
import { dependencies } from '@/test-support'
import getClient from '@/test-support/client'
import type { Middleware, Options } from '@kumahq/fake-api'
import type { EnvVars } from '@kumahq/settings/env'


// this needs to come from testing
const env = (
  env: EnvVars,
) => (key: keyof EnvVars, d = '') => {
  return env[key] || d
}
type AEnv = ReturnType<typeof env>
// temporary intercept returning Mocker
type Mocker = (route: string, opts?: Options, cb?: Middleware) => ReturnType<typeof cy['intercept']>
const $ = {
  EnvVars: token<EnvVars>('EnvVars'),
  env: token<AEnv>('env'),

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
  useClient,
] = createInjections($.mock, $.client)
