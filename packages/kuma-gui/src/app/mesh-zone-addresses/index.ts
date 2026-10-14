import { token } from '@kumahq/container'

import type { Can, Env } from '@/app/application'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('mesh-zone-addresses.routes'), {
      service: (can: Can) => {
        if(!can('use zones')) {
          return []
        }
        const { items } = routes()
        return [
          (route: RouteRecordRaw) => {
            if (route.name === 'mesh-detail-tabs-view') {
              route.children = (route.children ?? []).concat(items())
            }
          },
        ]
      },
      arguments: [
        app.can,
      ],
      labels: [
        app.routeWalkers,
      ],
    }],
    [token<Sources>('mesh-zone-addresses.sources'), {
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
    [token('mesh-zone-addresses.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
