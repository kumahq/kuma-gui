import { token, createInjections } from '@kumahq/container'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>
type DataplaneSources = ReturnType<typeof sources>

/**
 * Resolves a service to a route based on the type of the dataplane.
 * Allows contributions of any other module by using `labels` in the service container definition.
 */
export type DataPlaneServiceLink = (item: { params: Record<string, string> & { service: string }, dataplaneType: string }) => { name: string, params?: Record<string, string> } | undefined

const $ = {
  dataPlaneServiceLinks: token<DataPlaneServiceLink[]>('data-planes.data-plane-service-links'),
  rootViewRoute: token<() => RouteRecordRaw[]>('data-planes.root-view-route'),
}

export const TOKENS = $

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('data-planes.kri'), {
      service: () => {
        return [
          ({ shortName, mesh, kri }: { shortName: string, mesh: string, kri: string }) => {
            if(shortName === 'dp') {
              return {
                name: 'data-plane-detail-view',
                params: {
                  mesh,
                  proxy: kri,
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
    [token('data-planes.routes'), {
      service: (rootViewRoute: () => RouteRecordRaw[]) => {
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'mesh-detail-tabs-view') {
              item.children = (item.children ?? []).concat(routes().items())
            }
            if(item.name === 'mesh') {
              item.children = (item.children ?? []).concat(rootViewRoute())
            }
          },
        ]
      },
      arguments: [
        $.rootViewRoute,
      ],
      labels: [
        app.routeWalkers,
      ],
    }],
    [$.rootViewRoute, {
      service: () => routes().item,
    }],
    [token<DataplaneSources>('data-planes.sources'), {
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

    [token('data-planes.data-plane-service-links.default'), {
      service: (): DataPlaneServiceLink[] => [],
      labels: [
        $.dataPlaneServiceLinks,
      ],
    }],

    ...connections(app),
  ]
}

export const [
  useDataPlaneServiceLinks,
] = createInjections(
  $.dataPlaneServiceLinks,
)
