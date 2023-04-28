import { token, ServiceDefinition, createInjections } from '@/services/utils'
import type { Callback, Options } from '@/test-support'
import { mocker } from '@/test-support/intercept'

// this needs to come from testing
const env = () => (key: string, d = '') => {
  switch (key) {
    case 'KUMA_API_URL':
      return 'http://localhost:5681'
  }
  return d
}
type AEnv = ReturnType<typeof env>
type Server = typeof cy
// temporary intercept returning Mocker
type Mocker = (route: string, opts?: Options, cb?: Callback) => ReturnType<typeof cy['intercept']>
const $ = {
  env: token<AEnv>('env'),

  cy: token<Server>('cy'),
  mockServer: token('mockServer'),
  mock: token<Mocker>('mocker'),
  Env: token('Env'),

  logger: token('logger'),
  EnvVars: token('EnvVars'),
  bootstrap: token('bootstrap'),
}
type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [app.cy, {
    constant: cy,
  }],
  [app.mockServer, {
    service: (mock: Mocker) => {
      mock('*').as('request')
    },
    arguments: [
      app.mock,
    ],
  }],
  [app.mock, {
    service: mocker,
    arguments: [
      app.env,
      app.cy,
      app.fakeFS,
    ],
  }],
  // this will eventually come from testing
  [app.env, {
    service: env,
  }],

]
export const TOKENS = $
export const [
  useMock,
  useServer,
] = createInjections($.mock, $.mockServer)
