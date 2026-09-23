import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
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
        const _routes = routes('mesh')
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'mesh-detail-tabs-view') {
              item.children = (item.children ?? []).concat(_routes.items())
            }
            if(item.name === 'mesh') {
              item.children = (item.children ?? []).concat(_routes.item())
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
