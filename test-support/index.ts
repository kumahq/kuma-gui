import { config } from '@vue/test-utils'
import { setupServer } from 'msw/node'

import type { PluginDefinition, ComponentDefinition } from '@/app/vue'
import CliEnv from '@/services/env/CliEnv'
import createDisabledLogger from '@/services/logger/DisabledLogger'
import Logger from '@/services/logger/Logger'
import { Alias, ServiceConfigurator, token, createInjections } from '@/services/utils'
import { mocker, fakeApi, FS } from '@/test-support'
import type { Mocker } from '@/test-support'
import type { Component } from 'vue'

const $ = {
  mock: token<Mocker>('mocker'),
  server: token<ReturnType<typeof setupServer>>('server'),
}
export const services: ServiceConfigurator = (app) => [

  [token<Logger>('logger'), {
    service: createDisabledLogger,
    decorates: app.logger,
  }],

  [app.app, {
    service: (
      components: ComponentDefinition[],
      plugins: PluginDefinition[],
    ) => {
      components.forEach(([name, component]: [string, Component]) => {
        config.global.components[name] = component
      })

      plugins.forEach(([...args]) => {
        config.global.plugins.push([...args])
      })

      return async () => {
        throw new Error('You shouldn\'t be calling $.app during testing, just get(\'$.app\') is fine')
      }
    },
    arguments: [
      app.components,
      app.plugins,
    ],
  }],

  [$.server, {
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
      app.server,
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
export const [
  useMock,
  useServer,
] = createInjections($.mock, $.server)
