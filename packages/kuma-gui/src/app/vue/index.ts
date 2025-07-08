import { token, createInjections } from '@kumahq/kontainer'
import { createApp } from 'vue'
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import type { ServiceDefinition } from '@kumahq/kontainer'
import type { Directive } from 'vue'
import type { Router, RouteRecordRaw, NavigationGuard } from 'vue-router'
export { useRoute } from 'vue-router'

type Token = ReturnType<typeof token>

type VueApp = ReturnType<typeof createApp>
export type PluginDefinition = Parameters<VueApp['use']>
export type ComponentDefinition = Parameters<VueApp['component']>
export type ComponentWalkerDefinition = ((...args: ComponentDefinition) => ComponentDefinition)
export type RouteWalkerDefinition = ((route: RouteRecordRaw) => void)
export type DirectiveDefinition = [string, Directive]
export type GlobalDefinition = [string, unknown]

const $ = {
  app: token<(App: VueApp) => Promise<VueApp>>('vue.app'),
  router: token<Router>('vue.router'),

  components: token('vue.components'),
  directives: token<DirectiveDefinition[]>('vue.directives'),
  plugins: token<PluginDefinition[]>('vue.plugins'),
  globals: token<GlobalDefinition[]>('vue.globals'),
  routes: token<RouteRecordRaw[]>('vue.routes'),
  routesLabel: token<RouteRecordRaw[]>('vue.routes.label'),
  navigationGuards: token<NavigationGuard[]>('vue.routes.navigation.guards'),
  routeWalkers: token<RouteWalkerDefinition[]>('vue.routes.walkers'),
  componentWalkers: token<ComponentWalkerDefinition[]>('vue.components.walkers'),
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
        plugins: PluginDefinition[],
        components: ComponentDefinition[],
        directives: DirectiveDefinition[],
        globals: GlobalDefinition[],
        componentWalkers: ComponentWalkerDefinition[],
      ) => {
        return async (app: VueApp) => {
          const app_component = app.component.bind(app)

          const proxyApp = new Proxy(app, {
            get(target, prop: keyof VueApp) {
              switch(prop) {
                case 'use':
                  return (...[plugin, options]: PluginDefinition) => {
                    if(typeof plugin.install === 'function') {
                      plugin.install(proxyApp, options)
                      return proxyApp
                    }
                  }
                case 'component':
                  return (...args: ComponentDefinition | [string]) => {
                    if(args.length === 1) {
                      return app_component(...args)
                    }
                    app_component(...componentWalkers.reduce((prev, item) => item(...prev), args))
                    return proxyApp
                  }
                default:
                  return target[prop]
              }
            },
          })

          plugins.forEach(([...args]) => {
            proxyApp.use(...args)
          })

          components.forEach(item => {
            app_component(...componentWalkers.reduce((prev, item) => item(...prev), item))
          })

          directives.forEach(([name, item]) => {
            app.directive(name, item)
          })

          globals.forEach(([name, obj]) => {
            app.config.globalProperties[name] = obj
          })

          return app
        }
      },
      arguments: [
        $.plugins,
        $.components,
        $.directives,
        $.globals,
        $.componentWalkers,
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
    [token('application.directives'), {
      service: () => {
        return []
      },
      labels: [
        $.directives,
      ],
    }],
    [token('application.globals'), {
      service: () => {
        return []
      },
      labels: [
        $.globals,
      ],
    }],
    [token('application.componentWalkers'), {
      service: () => {
        return []
      },
      labels: [
        $.componentWalkers,
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
