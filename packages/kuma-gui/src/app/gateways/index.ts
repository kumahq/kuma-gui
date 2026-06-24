import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
export * from './routes'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('gateway.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('gateway.routes'), {
      service: () => {
        const _routes = routes()
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
    [token('gateway.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
