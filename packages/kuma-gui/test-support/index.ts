import { defaultKumaHtmlVars as htmlVars } from '@kumahq/config/vite'
import { ServiceConfigurator } from '@kumahq/container'
// This file should not be part of the barrel file as it depends on node
// utilities via import '@kumahq/config/vite' defaultKumaHtmlVars
import { config } from '@vue/test-utils'

import type { PluginDefinition, ComponentDefinition } from '@/app/vue'
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
  [app.htmlVars, {
    service: () => htmlVars,
  }],
]
