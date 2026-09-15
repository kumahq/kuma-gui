import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('hostname-generators.kri'), {
      service: () => {
        return [
          ({ shortName, mesh, kri }: { shortName: string, mesh: string, kri: string }) => {
            if(shortName === 'hg') {
              return {
                name: 'hostname-generator-detail-view',
                params: {
                  mesh,
                  kri,
                },
              }
            }
          },
        ]
      },
      labels: [
        app.kriHandlers,
      ],
    }],
    [token('hostname-generators.sources'), {
      service: (fetch: typeof globalThis.fetch, env: Env) => sources({
        fetch,
        baseUrl: env('KUMA_API_URL'),
      }),
      arguments: [
        app.fetch,
        app.env,
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
