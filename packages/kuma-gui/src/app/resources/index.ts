import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { routes, controlPlaneRoutes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>
type ResourcesSources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token<ResourcesSources>('resources.sources'), {
      service: (fetch: typeof globalThis.fetch, env: Env) => sources({
        fetch,
        baseUrl: env('KUMA_API_URL'),
      }),
      arguments: [
        app.fetch,
        app.env,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('resources.routes'), {
      service: () => {
        const { item, items } = routes('mesh')
        const controlPlaneResources = routes('control-plane')
        const cpRoutes = controlPlaneRoutes()
        cpRoutes[0].children = controlPlaneResources.items()[0].children
        cpRoutes.push(controlPlaneResources.item()[0])
        return [
          (route: RouteRecordRaw) => {
            if (route.name === 'control-plane-root-view') {
              route.children = (route.children ?? []).concat(cpRoutes)
            }
            if (route.name === 'mesh-detail-tabs-view') {
              route.children = (route.children ?? []).concat(items())
            }
            if(route.name === 'mesh') {
              route.children = (route.children ?? []).concat(item())
            }
          },
        ]
      },
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('resources.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
