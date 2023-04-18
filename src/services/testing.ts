import { setupServer } from 'msw/node'

import { ServiceConfigurator, token } from './utils'
import { mocker } from '@/test-support'
import type { Mocker } from '@/test-support'
import type { RestHandler } from 'msw'

const $ = {
  mock: token<Mocker>('mocker'),
}

export const services: ServiceConfigurator = (app) => [
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
export const TOKENS = $
