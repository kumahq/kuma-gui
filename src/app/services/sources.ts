import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  ServiceInsight,
} from '@/types/index.d'

type MeshParams = {
  mesh: string
}
type PaginationParams = {
  size: number
  page: number
}
type Closeable = { close: () => void }
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export const sources = (api: KumaApi) => {
  return {
    '/:mesh/services': async (params: MeshParams & PaginationParams, source: Closeable) => {
      const offset = params.size * (params.page - 1)
      const res = await api.getAllServiceInsightsFromMesh({
        mesh: params.mesh,
      }, {
        size: params.size,
        offset,
      })
      source.close()
      return res
    },
  }
}
