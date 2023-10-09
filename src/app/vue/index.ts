import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections } from '@/services/utils'
import type { Component } from 'vue'
import type { Router, RouteRecordRaw, NavigationGuard } from 'vue-router'

type Token = ReturnType<typeof token>

type VueApp = ReturnType<typeof createApp>
export type PluginDefinition = Parameters<VueApp['use']>
export type ComponentDefinition = [string, Component]

const $ = {
  app: token<(App: Component) => Promise<VueApp>>('vue.app'),
  router: token<Router>('vue.router'),

  components: token('vue.components'),
  plugins: token<PluginDefinition[]>('vue.plugins'),
  routes: token<RouteRecordRaw[]>('vue.routes'),
  routesLabel: token<RouteRecordRaw[]>('vue.routes.label'),
  navigationGuards: token<NavigationGuard[]>('vue.routes.navigation.guards'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.app, {
      service: (
        components: ComponentDefinition[],
        plugins: PluginDefinition[],
      ) => {
        return async (App: Component) => {
          const app = createApp(App)

          components.forEach(([name, component]: [string, Component]) => {
            app.component(name, component)
          })

          plugins.forEach(([...args]) => {
            app.use(...args)
          })

          return app
        }
      },
      arguments: [
        $.components,
        $.plugins,
      ],
    }],
    [$.router, {
      service: (
        env: (str: 'KUMA_BASE_PATH') => string,
        routes: RouteRecordRaw[],
        guards: NavigationGuard[],
      ) => {
        const router = createRouter({
          history: createWebHistory(env('KUMA_BASE_PATH')),
          routes,
        })

        guards.forEach((item) => {
          if (typeof item === 'function') {
            router.beforeEach(item)
          }
        })

        return router
      },
      arguments: [
        app.env,
        $.routes,
        $.navigationGuards,
      ],
    }],

    [token('vue.plugins'), {
      service: (router) => {
        return [
          [router],
        ]
      },
      arguments: [
        $.router,
      ],
      labels: [
        $.plugins,
      ],
    }],

    // TODO(jc): Label decoration. Make it so we can decorate labels
    // Temporarily turn the routesLabel label into routes for decoration
    // purposes
    [$.routes, {
      service: (routes: RouteRecordRaw[]) => routes,
      arguments: [
        $.routesLabel,
      ],
    }],
    //

    // TODO(jc): Make it so we don't need to provide a [] empty default for
    // labels
    [token('application.routes.navigation.guards'), {
      service: () => {
        return []
      },
      labels: [
        $.navigationGuards,
      ],
    }],
  ]
}

export const TOKENS = $
export const [
  useRouter,
] = createInjections(
  TOKENS.router,
)
