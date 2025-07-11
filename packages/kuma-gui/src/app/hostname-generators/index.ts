import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('hostname-generators.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('hostname-generators.routes'), {
      service: () => {
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'control-plane-root-view') {
              item.children = (item.children ?? []).concat(routes())
            }
          },
        ]
      },
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('hostname-generators.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
