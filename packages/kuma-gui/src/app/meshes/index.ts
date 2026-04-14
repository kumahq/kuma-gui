import { token, createInjections } from '@kumahq/container'

import MeshActionGroup from './components/MeshActionGroup.vue'
import MeshInsightsList from './components/MeshInsightsList.vue'
import MeshStatus from './components/MeshStatus.vue'
import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import type { SplitRouteRecordRaw } from './routes'
import { sources } from './sources'
import { services as dataplanes } from '@/app/data-planes'
import { services as externalServicesModule } from '@/app/external-services'
import { services as gatewaysModule } from '@/app/gateways'
import { services as legacyDataplanes } from '@/app/legacy-data-planes'
import { services as meshIdentities } from '@/app/mesh-identities'
import { services as meshTrusts } from '@/app/mesh-trusts'
import { services as policies } from '@/app/policies'
import { services as resources } from '@/app/resources'
import { services as rules } from '@/app/rules'
import { services as servicesModule } from '@/app/services'
import { services as workloads } from '@/app/workloads'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'


type Token = ReturnType<typeof token>

const $ = {
  MeshInsightsList: token<typeof MeshInsightsList>('meshes.components.MeshInsightsList'),
  MeshActionGroup: token<typeof MeshActionGroup>('meshes.components.MeshActionGroup'),
  MeshStatus: token<typeof MeshStatus>('meshes.components.MeshStatus'),
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
    [$.MeshStatus, {
      service: () => MeshStatus,
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
      service: (r, can) => {
        return [
          (item: RouteRecordRaw) => {
            if (item.name === 'control-plane-root-view') {
              item.children = (item.children ?? []).concat(routes(can, r[0], r[1], r[2], r[3], r[4], r[5]))
            }
          },
        ]
      },
      arguments: [
        mesh.routes,
        app.can,
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
    [token('meshes.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    ...servicesModule(mesh),
    ...externalServicesModule(mesh),
    ...gatewaysModule(mesh),
    ...dataplanes(mesh),
    ...legacyDataplanes(mesh),
    ...policies(mesh),
    ...rules(mesh),
    ...workloads(mesh),
    ...resources(mesh),
    ...meshIdentities(mesh),
    ...meshTrusts(mesh),
  ]
}
export const TOKENS = $
export const [
  useMeshInsightsList,
  useMeshActionGroup,
  useMeshStatus,
] = createInjections(
  $.MeshInsightsList,
  $.MeshActionGroup,
  $.MeshStatus,
)
