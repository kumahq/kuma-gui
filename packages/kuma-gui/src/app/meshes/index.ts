import { token, createInjections } from '@kumahq/kontainer'

import MeshActionGroup from './components/MeshActionGroup.vue'
import MeshInsightsList from './components/MeshInsightsList.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import type { SplitRouteRecordRaw } from './routes'
import { sources } from './sources'
import { services as dataplanes } from '@/app/data-planes'
import { services as externalServicesModule } from '@/app/external-services'
import { services as gatewaysModule } from '@/app/gateways'
import { services as policies } from '@/app/policies'
import { services as rules } from '@/app/rules'
import { services as servicesModule } from '@/app/services'
import type { ServiceDefinition } from '@kumahq/kontainer'
import type { RouteRecordRaw } from 'vue-router'

type Token = ReturnType<typeof token>

const $ = {
  MeshInsightsList: token<typeof MeshInsightsList>('meshes.components.MeshInsightsList'),
  MeshActionGroup: token<typeof MeshActionGroup>('meshes.components.MeshActionGroup'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  const mesh = {
    ...app,
    routes: token<SplitRouteRecordRaw[]>('meshes.routes.children'),
  }
  return [
    [$.MeshInsightsList, {
      service: () => {
        return MeshInsightsList
      },
    }],
    [$.MeshActionGroup, {
      service: () => MeshActionGroup,
    }],
    [token('meshes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('meshes.routes'), {
      service: (r) => {
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'control-plane-root-view') {
              item.children = (item.children ?? []).concat(routes(r[0], r[1], r[2], r[3]))
            }
          },
        ]
      },
      arguments: [
        mesh.routes,
      ],
      labels: [
        app.routeWalkers,
      ],
    }],
    [token('meshes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...servicesModule(mesh),
    ...externalServicesModule(mesh),
    ...gatewaysModule(mesh),
    ...dataplanes(mesh),
    ...policies(mesh),
    ...rules(mesh),
  ]
}
export const TOKENS = $
export const [
  useMeshInsightsList,
  useMeshActionGroup,
] = createInjections(
  $.MeshInsightsList,
  $.MeshActionGroup,
)
