import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  DataPlaneOverview as DataplaneOverview,
} from '@/types/index.d'
import { normalizeFilterFields } from '@/utilities/normalizeFilterFields'
type DataplaneTypeParams = {
  type: 'all' | 'delegated' | 'builtin'
}

type Closeable = { close: () => void }
type PaginationParams = {
  size: number
  page: number
  search: string
}
type MeshParams = {
  mesh: string
}
export type GatewayCollection = CollectionResponse<DataplaneOverview>
export type GatewayCollectionSource = DataSourceResponse<GatewayCollection>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/gateways': async (params: MeshParams & PaginationParams, source: Closeable) => {
      source.close()
      const offset = params.size * (params.page - 1)
      return api.getAllDataplaneOverviewsFromMesh({
        mesh: params.mesh,
      }, {
        gateway: 'true',
        offset,
        size: params.size,
      })
    },
    '/meshes/:mesh/gateways/of/:type': async (params: MeshParams & DataplaneTypeParams & PaginationParams, source: Closeable) => {
      source.close()
      const offset = params.size * (params.page - 1)
      return api.getAllDataplaneOverviewsFromMesh({
        mesh: params.mesh,
      }, {
        ...Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]'))),
        gateway: params.type === 'all' ? 'true' : params.type,
        offset,
        size: params.size,
      })
    },
  }
}
