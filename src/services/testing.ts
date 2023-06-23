import { setupServer } from 'msw/node'

import createDisabledLogger from './logger/DisabledLogger'
import { Alias, ServiceConfigurator, token } from './utils'
import CliEnv from '@/services/env/CliEnv'
import Logger from '@/services/logger/Logger'
import { mocker, fakeApi, FS } from '@/test-support'
import type { Mocker } from '@/test-support'

const $ = {
  mock: token<Mocker>('mocker'),
}

export const services: ServiceConfigurator = (app) => [
  [token<Logger>('logger'), {
    service: createDisabledLogger,
    decorates: app.logger,
  }],

  [app.msw, {
    service: (env: Alias<CliEnv['var']>, fs: FS) => {
      const mock = fakeApi(env, fs)
      return setupServer(...mock('*'))
    },
    arguments: [
      app.env,
      app.fakeFS,
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
  [app.Env, {
    service: CliEnv,
    arguments: [
      app.EnvVars,
    ],
  }],
]
export const TOKENS = $
