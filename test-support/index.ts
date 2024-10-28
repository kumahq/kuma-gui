import { config } from '@vue/test-utils'

import CliEnv from '@/app/application/services/env/CliEnv'
import type { PluginDefinition, ComponentDefinition } from '@/app/vue'
import { ServiceConfigurator } from '@/services/utils'
import type { Component } from 'vue'

export const services: ServiceConfigurator = (app) => [
  [app.app, {
    service: (
      components: ComponentDefinition[],
      plugins: PluginDefinition[],
    ) => {
      plugins.forEach(([...args]) => {
        config.global.plugins.push([...args])
      })

      components.forEach(([name, component]: [string, Component]) => {
        config.global.components[name] = component
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

  [app.Env, {
    service: CliEnv,
    arguments: [
      app.EnvVars,
    ],
  }],
]
