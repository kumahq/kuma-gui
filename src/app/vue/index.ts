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
const addRouteName = (item: RouteRecordRaw, _parent?: RouteRecordRaw) => {
  if (typeof item.component !== 'function') {
    return
  }
  // @ts-ignore at this point item.component has to be a function because we checked it above
  const component = item.component.bind(item)
  item.component = async () => {
    // we need to create a new instance of the component as import is
    // natively cached we could re-cache this in a WeakMap if it becomes
    // necessary (I don't think it will)
    const cached = (await component()).default
    if (typeof cached.render === 'function') {
      return {
        default: {
          ...cached,
          render: (...args: Record<string, unknown>[]) => {
            args[0].$routeName = item.name
            return cached.render(...args)
          },
        },
      }
    } else if (typeof cached.setup === 'function') {
      return {
        default: {
          ...cached,
          setup: (...args: any[]) => {
            const func = cached.setup(...args)
            return (...args: Record<string, unknown>[]) => {
              args[0].$routeName = item.name
              return func(...args)
            }
          },
        },
      }

    }
    return cached
  }
}
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
    addRouteName(item, parent)
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
