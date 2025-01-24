import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections } from '@/services/utils'
import type { Component, Directive } from 'vue'
import type { Router, RouteRecordRaw, NavigationGuard } from 'vue-router'
export { useRoute } from 'vue-router'

type Token = ReturnType<typeof token>

type VueApp = ReturnType<typeof createApp>
export type PluginDefinition = Parameters<VueApp['use']>
export type ComponentDefinition = [string, Component]
export type DirectiveDefinition = [string, Directive]

const $ = {
  app: token<(App: Component) => Promise<VueApp>>('vue.app'),
  router: token<Router>('vue.router'),

  components: token('vue.components'),
  directives: token<DirectiveDefinition[]>('vue.directives'),
  plugins: token<PluginDefinition[]>('vue.plugins'),
  routes: token<RouteRecordRaw[]>('vue.routes'),
  routesLabel: token<RouteRecordRaw[]>('vue.routes.label'),
  navigationGuards: token<NavigationGuard[]>('vue.routes.navigation.guards'),
  routeWalkers: token<NavigationGuard[]>('vue.routes.walkers'),
}

type RouteWalker = (item: RouteRecordRaw, parent?: RouteRecordRaw) => void
function walkRoutes(walker: RouteWalker, routes: RouteRecordRaw[], parent?: RouteRecordRaw) {
  routes.forEach((item) => {
    walker(item, parent)
    if (typeof item.children !== 'undefined') {
      walkRoutes(walker, item.children, item)
    }
  })
  return routes
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.app, {
      service: (
        components: ComponentDefinition[],
        directives: DirectiveDefinition[],
        plugins: PluginDefinition[],
      ) => {
        return async (App: Component) => {
          const app = createApp(App)

          plugins.forEach(([...args]) => {
            app.use(...args)
          })

          components.forEach(([name, item]) => {
            app.component(name, item)
          })

          directives.forEach(([name, item]) => {
            app.directive(name, item)
          })

          return app
        }
      },
      arguments: [
        $.components,
        $.directives,
        $.plugins,
      ],
    }],
    [$.router, {
      service: (
        env: (str: 'KUMA_BASE_PATH') => string,
        routes: RouteRecordRaw[],
        guards: NavigationGuard[],
        walkers: RouteWalker[],
      ) => {

        const router = createRouter({
          history: createWebHistory(env('KUMA_BASE_PATH')),
          routes: walkRoutes((item, parent) => {
            walkers.forEach(walker => walker(item, parent))
          }, [
            {
              path: '/',
              name: 'app',
              meta: {
                path: '',
              },
              children: routes,
            },
          ]),
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
        $.routeWalkers,
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
