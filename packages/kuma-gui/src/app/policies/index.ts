import { token, createInjections } from '@kumahq/container'

import PolicyActionGroup from './components/PolicyActionGroup.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>

const $ = {
  PolicyActionGroup: token<typeof PolicyActionGroup>('policies.components.PolicyActionGroup'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.PolicyActionGroup, {
      service: () => PolicyActionGroup,
    }],
    [token('policies.kri'), {
      service: () => {
        return [
          // policies
          ({ shortName, mesh, kri }: { shortName: string, mesh: string, kri: string }) => {
            if ([
              'mal',
              'mcb',
              'mfi',
              'mhttpr',
              'mhc',
              'mlbs',
              'mm',
              'mp',
              'mpp',
              'mrl',
              'mr',
              'mtcpr',
              'mtls',
              'mt',
              'mtr',
              'mtp',
            ].includes(shortName)) {
              return {
                name: 'policy-detail-view',
                params: {
                  mesh,
                  policy: kri,
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
    [token('policies.sources'), {
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
    [token('policies.routes'), {
      service: () => {
        const _routes = routes()
        return [
          (item: RouteRecordRaw) => {
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
    [token('policies.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
export const TOKENS = $
export const [
  usePolicyActionGroup,
] = createInjections(
  $.PolicyActionGroup,
)
