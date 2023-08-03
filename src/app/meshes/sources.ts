import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { Mesh, MeshInsight } from '@/types/index.d'

type DetailParams = {
  name: string
}

type PaginationParams = {
  size: number
  page: number
}

type Closeable = { close: () => void }

export type MeshSource = DataSourceResponse<Mesh>
export type MeshCollection = CollectionResponse<Mesh>
export type MeshCollectionSource = DataSourceResponse<MeshCollection>

export type MeshInsightSource = DataSourceResponse<MeshInsight>

export const sources = (api: KumaApi) => {
  return {
    '/meshes': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const size = params.size
      const offset = params.size * (params.page - 1)

      return api.getAllMeshes({ size, offset })
    },

    '/meshes/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const name = params.name

      return api.getMesh({ name })
    },

    '/mesh-insights/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const name = params.name

      return api.getMeshInsights({ name })
    },

  }
}
