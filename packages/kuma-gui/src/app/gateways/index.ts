import { token } from '@kumahq/container'

import GatewayPolicies from './components/GatewayPolicies.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { DataPlaneServiceLink } from '@/app/data-planes'
import type { ServiceDefinition } from '@kumahq/container'
import type { Router, RouteRecordRaw } from 'vue-router'
export * from './routes'

type Token = ReturnType<typeof token>

const $ = {
  GatewayPolicies: token<typeof GatewayPolicies>('gateways.components.GatewayPolicies'),
}

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

    [token('gateway.data-plane-service-link'), {
      service: (router: Router): DataPlaneServiceLink[] => [
        ({ params, dataplaneType }) => dataplaneType === 'delegated' && router.hasRoute('delegated-gateway-detail-view')
          ? { name: 'delegated-gateway-detail-view', params }
          : undefined,
        ({ params, dataplaneType }) => dataplaneType === 'gateway' && router.hasRoute('builtin-gateway-detail-view')
          ? { name: 'builtin-gateway-detail-view', params: { gateway: params.service } }
          : undefined,
      ],
      arguments: [
        app.router,
      ],
      labels: [
        app.dataPlaneServiceLinks,
      ],
    }],
    [$.GatewayPolicies, {
      service: () => {
        return GatewayPolicies
      },
      decorates: app.DataPlanePolicies,
    }],
  ]
}
