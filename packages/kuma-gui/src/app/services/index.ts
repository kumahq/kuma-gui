import { createInjections, token } from '@kumahq/container'

import { features } from './features'
import ServiceListTabsActionGroup from './components/ServiceListTabsActionGroup.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

const $ = {
  serviceListTabsActionGroup: token<typeof ServiceListTabsActionGroup>('services.service-list-tabs-action-group'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('services.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('services.routes'), {
      service: (can: Can) => {
        const _routes = routes(can)
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'mesh-detail-tabs-view') {
              item.children = (item.children ?? []).concat(_routes.items())
            }
            if (item.name === 'mesh') {
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
    [token('services.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],

    [token('services.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [$.serviceListTabsActionGroup, {
      service: () => ServiceListTabsActionGroup,
    }],
  ]
}

export const TOKENS = $
export const [
  useServiceListTabsActionGroup,
] = createInjections(
  $.serviceListTabsActionGroup,
)
