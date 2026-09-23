import { token } from '@kumahq/container'


import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('workloads.routes'), {
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
    [token('workloads.sources'), {
      service: (api: KumaApi) => sources({
        baseUrl: api.client.baseUrl,
        fetch: api.client.fetch,
      }),
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('workloads.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
