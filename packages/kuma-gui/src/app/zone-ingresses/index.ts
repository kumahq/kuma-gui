import { token } from '@kumahq/container'

import { routes } from './routes'
import { sources } from './sources'
import ingressLocales from '@/app/zone-ingresses/locales/en-us/index.yaml'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('zones-ingresses.routes'), {
      service: () => {
        return [
          (item: RouteRecordRaw) => {
            const _routes = routes()
            if (item.name === 'zone-cp-detail-tabs-view') {
              const children = item.children ?? []
              item.children = [children[0], children[1], ..._routes.items(), ...children.splice(2)].filter((route) => !!route)
            }
            if (item.name === 'zone-cp-detail-abstract-view') {
              item.children = (item.children ?? []).concat(_routes.item())
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
    [token('zones-ingresses.locales'), {
      service: () => ingressLocales,
      labels: [
        app.enUs,
      ],
    }],
    [token('zone-ingresses.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
