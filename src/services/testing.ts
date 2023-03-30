
import { setupServer } from 'msw/node'

import { ServiceDefinition, token } from './utils'
import { mocker } from '@/test-support'
import type { Mocker } from '@/test-support'
import type { RestHandler } from 'msw'

export const TOKENS = {
  mock: token<Mocker>('mocker'),
}
const $ = TOKENS

type Token = ReturnType<typeof token>
export const services = <T extends Record<string, Token>>(app: T): ServiceDefinition[] => [
  [app.msw, {
    service: (handlers: RestHandler[]) => {
      return setupServer(...handlers)
    },
    arguments: [
      app.mswHandlers,
    ],
  }],
  [$.mock, {
    service: mocker,
    arguments: [
      app.env,
      app.msw,
      app.fakeFS,
    ],
  }],
]
