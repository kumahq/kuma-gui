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
    '/:mesh/meshes': async (params: MeshParams & PaginationParams, source: Closeable) => {
      source.close()
      const offset = params.size * params.page
      return api.getAllMeshes({
        size: params.size,
        offset,
      })
    },
    '/:mesh/mesh': (params: MeshParams, source: Closeable) => {
      source.close()
      return api.getMesh({ name: params.mesh })
    },
    '/:mesh/insights': async (params: MeshParams, source: Closeable) => {
      source.close()
      if (params.mesh === '*') {
        return api.getAllMeshInsights()
      } else {
        return api.getMeshInsights({ name: params.mesh })
      }
    },

  }
}
