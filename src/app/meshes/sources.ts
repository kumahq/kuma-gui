import { Mesh, MeshInsight } from './data'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

type DetailParams = {
  name: string
}

type PaginationParams = {
  size: number
  page: number
}

export type MeshSource = DataSourceResponse<Mesh>

export type MeshInsightSource = DataSourceResponse<MeshInsight>
export type MeshInsightCollection = CollectionResponse<MeshInsight>
export type MeshInsightCollectionSource = DataSourceResponse<MeshInsightCollection>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:name': async (params: DetailParams) => {
      const { name } = params

      return Mesh.fromObject(await api.getMesh({ name }))
    },

    '/meshes/:name/as/kubernetes': (params: DetailParams) => {
      const { name } = params
      return api.getMesh({ name }, { format: 'kubernetes' })
    },

    '/mesh-insights': async (params: PaginationParams) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return MeshInsight.fromCollection(await api.getAllMeshInsights({ size, offset }))
    },

    '/mesh-insights/:name': async (params: DetailParams) => {
      const { name } = params

      return MeshInsight.fromObject(await api.getMeshInsights({ name }))
    },
  }
}
