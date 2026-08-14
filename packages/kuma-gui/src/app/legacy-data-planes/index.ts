import { createInjections, token } from '@kumahq/container'

import DataPlanePolicies from './components/DataPlanePolicies.vue'
import { routes } from './routes'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

const $ = {
  DataPlanePolicies: token<typeof DataPlanePolicies>('legacy.data-planes.policies'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('legacy.data-planes.routes'), {
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
    [$.DataPlanePolicies, {
      service: () => DataPlanePolicies,
    }],
    ...connections(app),
  ]
}

export const TOKENS = $
export const [
  useDataPlanePolicies,
] = createInjections(
  $.DataPlanePolicies,
)
