import { KumaHtmlVars } from '@kumahq/config/vite'
import { ServiceConfigurator, token } from '@kumahq/container'
import { CliEnv } from '@kumahq/settings/cli-env'
import { config } from '@vue/test-utils'

import type { PluginDefinition, ComponentDefinition } from '@/app/vue'
import type { Component } from 'vue'

const $ = {
  htmlVars: token<KumaHtmlVars>('htmlVars'),
}
export const TOKENS = $

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
