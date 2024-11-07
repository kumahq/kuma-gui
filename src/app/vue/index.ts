import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections } from '@/services/utils'
import type { Component } from 'vue'
import type { Router, RouteRecordRaw, NavigationGuard } from 'vue-router'
export { useRoute } from 'vue-router'

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

// @TODO at some point we should expose this as an extendable thing
// similar to navigationGuards. We'd then do this specific functionality in
// `@app/application` as it relates to RouteView
const addModule = (item: RouteRecordRaw, parent?: RouteRecordRaw) => {
  item.meta = {
    ...(item.meta ?? {}),
  }
  if (typeof parent?.meta?.module !== 'undefined') {
    item.meta.module = parent.meta.module
  }
}
const addPath = (item: RouteRecordRaw, parent?: RouteRecordRaw) => {
  item.meta = {
    ...(item.meta ?? {}),
  }
  if (typeof parent?.meta?.path !== 'undefined') {
    const path = String(parent.meta.path) ?? ''
    item.meta.path = `${path}${path.length > 0 ? '.' : ''}${String(item.name)}`
  }
}
function walkRoutes(routes: RouteRecordRaw[], parent?: RouteRecordRaw) {
  routes.forEach((item) => {
    // this is very specific to app/application
    addModule(item, parent)
    addPath(item, parent)
    //
    if (typeof item.children !== 'undefined') {
      walkRoutes(item.children, item)
    }
  })
  return routes
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

          plugins.forEach(([...args]) => {
            app.use(...args)
          })

          components.forEach(([name, component]: [string, Component]) => {
            app.component(name, component)
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
          routes: walkRoutes([
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
