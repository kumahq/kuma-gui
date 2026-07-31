import { token } from '@kumahq/container'

import { routes } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application'
import egressLocales from '@/app/zone-egresses/locales/en-us/index.yaml'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('zones-engresses.routes'), {
      service: (can: Can) => {
        return [
          (item: RouteRecordRaw) => {
            const _routes = routes(can)
            if (item.name === 'zone-cp-detail-tabs-view') {
              const children = item.children ?? []
              item.children = [children[0], children[1], ..._routes.items(), ...children.splice(2)].filter((route) => !!route)
            }
            if (item.name === 'zone-cp-detail-abstract-view') {
              item.children = (item.children ?? []).concat(_routes.item())
            }
            
            if(!can('use zones') && item.name === 'control-plane-root-view') {
              item.children = (item.children ?? []).concat(_routes.items())
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
    [token('zone-egresses.locales'), {
      service: () => egressLocales,
      labels: [
        app.enUs,
      ],
    }],
    [token('zone-egresses.sources'), {
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
