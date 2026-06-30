import { token } from '@kumahq/container'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { sources } from './sources'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>
type DataplaneSources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    // TODO: Uncomment once the legacy routes are removed
    // [token('data-planes.routes'), {
    //   service: () => {
    //     const _routes = routes()
    //     return [
    //       (item: RouteRecordRaw) => {
    //         if (item.name === 'mesh-detail-tabs-view') {
    //           item.children = (item.children ?? []).concat(_routes.items())
    //         }
    //         if(item.name === 'mesh') {
    //           item.children = (item.children ?? []).concat(_routes.item())
    //         }
    //       },
    //     ]
    //   },
    //   labels: [
    //     app.routeWalkers,
    //   ],
    // }],
    [token<DataplaneSources>('data-planes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('data-planes.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('data-planes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...connections(app),
  ]
}
