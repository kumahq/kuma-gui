import { token } from '@kumahq/container'

import DataplaneServiceLink from './components/DataplaneServiceLink.vue'
import GatewayPolicies from './components/GatewayPolicies.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
export * from './routes'

type Token = ReturnType<typeof token>

const $ = {
  GatewayPolicies: token<typeof GatewayPolicies>('gateways.components.GatewayPolicies'),
  DataplaneServiceLink: token<typeof DataplaneServiceLink>('gateways.components.DataplaneServiceLink'),
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
    [$.GatewayPolicies, {
      service: () => {
        return GatewayPolicies
      },
      decorates: app.DataPlanePolicies,
    }],
    [$.DataplaneServiceLink, {
      service: () => {
        return DataplaneServiceLink
      },
      decorates: app.DataplaneServiceLink,
    }],
  ]
}
