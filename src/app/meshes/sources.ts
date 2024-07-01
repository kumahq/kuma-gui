import { Mesh, MeshInsight } from './data'
import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type MeshSource = DataSourceResponse<Mesh>

export type MeshInsightSource = DataSourceResponse<MeshInsight>
export type MeshInsightCollection = CollectionResponse<MeshInsight>
export type MeshInsightCollectionSource = DataSourceResponse<MeshInsightCollection>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:name': async (params) => {
      const { name } = params

      return Mesh.fromObject(await api.getMesh({ name }))
    },

    '/meshes/:name/as/kubernetes': (params) => {
      const { name } = params
      return api.getMesh({ name }, { format: 'kubernetes' })
    },

    '/mesh-insights': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return MeshInsight.fromCollection(await api.getAllMeshInsights({ size, offset }))
    },

    '/mesh-insights/:name': async (params) => {
      const { name } = params

      return MeshInsight.fromObject(await api.getMeshInsights({ name }))
    },
  })
}
