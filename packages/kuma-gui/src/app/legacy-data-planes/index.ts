import { token } from '@kumahq/container'

import { routes } from './routes'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('legacy.data-planes.routes'), {
      service: () => {
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'mesh-detail-tabs-view') {
              item.children = (item.children ?? []).concat(routes().items())
            }
            if(item.name === 'mesh') {
              item.children = (item.children ?? []).concat(routes().item())
            }
          },
        ]
      },
      labels: [
        app.routeWalkers,
      ],
    }],
    ...connections(app),
  ]
}
