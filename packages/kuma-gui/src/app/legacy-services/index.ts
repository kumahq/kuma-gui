import { token } from '@kumahq/container'

import ServiceListTabsActionGroup from './components/ServiceListTabsActionGroup.vue'
import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { DataPlaneServiceLink } from '@/app/data-planes'
import type { ServiceDefinition } from '@kumahq/container'
import type { Router, RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('legacy-services.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('legacy-services.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    [token('legacy-services.routes'), {
      service: () => {
        const _routes = routes()
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'service-list-tabs-view') {
              item.children = [..._routes.items(), ...item.children ?? []]
            }
            if(item.name === 'service-detail-index-view') {
              item.children = (item.children ?? []).concat(_routes.item())
            }
          },
        ]
      },
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('legacy-services.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    
    [token('legacy-services.data-plane-service-link'), {
      service: (router: Router): DataPlaneServiceLink[] => [
        ({ params, dataplaneType }) => {
          return dataplaneType === 'standard' && router.hasRoute('service-detail-view')
            ? { name: 'service-detail-view', params }
            : undefined},
      ],
      arguments: [
        app.router,
      ],
      labels: [
        app.dataPlaneServiceLinks,
      ],
    }],

    [token<typeof ServiceListTabsActionGroup>('legacy-services.service-list-tabs-action-group'), {
      service: () => ServiceListTabsActionGroup,
      decorates: app.serviceListTabsActionGroup,
    }],
  ]
}
