import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  Mesh,
  MeshInsight,
} from '@/types/index.d'

type MeshParams = {
  mesh: string
}
type PaginationParams = {
  size: number
  page: number
}

type Closeable = {close: () => void}

export type MeshSource = DataSourceResponse<Mesh>
export type MeshCollection = CollectionResponse<Mesh>
export type MeshCollectionSource = DataSourceResponse<MeshCollection>

export type MeshInsightSource = DataSourceResponse<MeshInsight>

export const sources = (api: KumaApi) => {
  return {
    '/meshes': async (params: MeshParams & PaginationParams, source: Closeable) => {
      const offset = params.size * (params.page - 1)
      const res = await api.getAllMeshes({
        size: params.size,
        offset,
      })
      source.close()
      return res
    },
    '/:mesh/mesh': async (params: MeshParams, source: Closeable) => {
      const res = await api.getMesh({ name: params.mesh })
      source.close()
      return res
    },
    '/:mesh/insights': async (params: MeshParams, source: Closeable) => {
      const res = await api.getMeshInsights({ name: params.mesh })
      source.close()
      return res
    },

  }
}
