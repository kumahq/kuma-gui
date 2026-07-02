import { token, createInjections } from '@kumahq/container'

import MeshActionGroup from './components/MeshActionGroup.vue'
import MeshInsightsList from './components/MeshInsightsList.vue'
import MeshStatus from './components/MeshStatus.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { RouteRecordRaw } from 'vue-router'


type Token = ReturnType<typeof token>

const $ = {
  MeshInsightsList: token<typeof MeshInsightsList>('meshes.components.MeshInsightsList'),
  MeshActionGroup: token<typeof MeshActionGroup>('meshes.components.MeshActionGroup'),
  MeshStatus: token<typeof MeshStatus>('meshes.components.MeshStatus'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
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
    [token('meshes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
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
