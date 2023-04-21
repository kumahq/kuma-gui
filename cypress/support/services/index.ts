import { token, ServiceDefinition, createInjections } from '@/services/utils'
import type { FS, Mocker } from '@/test-support'
import { mocker } from '@/test-support/intercept'
import { fs } from '@/test-support/mocks/fs'

// this needs to come from production
const env = () => (_key: string) => {
  return 'http://localhost:5681'
}
type AEnv = ReturnType<typeof env>
type Server = typeof cy
const $ = {
  env: token<AEnv>('env'),
  fakeFS: token<FS>('fake.fs'),
  kumaFS: token<FS>('fake.fs.kuma'),

  cy: token<Server>('cy'),
  mockServer: token('mockServer'),
  mock: token<Mocker>('mocker'),
}
type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [app.cy, {
    constant: cy,
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
      app.env,
      app.cy,
      app.fakeFS,
    ],
  }],
  // this will eventually come from production
  [app.env, {
    service: env,
  }],
  // this will eventually come from development
  [app.kumaFS, {
    constant: fs,
    labels: [
      app.fakeFS,
    ],
  }],

]
export const TOKENS = $
export const [
  useMock,
  useServer,
] = createInjections($.mock, $.mockServer)
