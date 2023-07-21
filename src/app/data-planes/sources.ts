import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  DataPlaneOverview as DataplaneOverview,
} from '@/types/index.d'
import { normalizeFilterFields } from '@/utilities/normalizeFilterFields'

type Closeable = { close: () => void }
type PaginationParams = {
  size: number
  page: number
  search: string
}
type MeshParams = {
  mesh: string
}
type ServiceParams = {
  service: string
}
type DataplaneTypeParams = {
  type: 'all' | 'delegated' | 'builtin'
}

export type DataPlaneCollection = CollectionResponse<DataplaneOverview>
export type DataPlaneCollectionSource = DataSourceResponse<DataPlaneCollection>

export const sources = (api: KumaApi) => {
  return {
    '/:mesh/dataplanes': async (params: MeshParams & PaginationParams, source: Closeable) => {
      source.close()
      const offset = params.size * (params.page - 1)
      return api.getAllDataplaneOverviewsFromMesh({
        mesh: params.mesh,
      }, {
        ...Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]'))),
        offset,
        gateway: 'false',
        size: params.size,
      })
    },
    '/:mesh/dataplanes/for/:service/of/:type': async (params: MeshParams & ServiceParams & PaginationParams & DataplaneTypeParams, source: Closeable) => {
      source.close()
      const offset = params.size * (params.page - 1)
      // here 'all' means both proxies/sidecars and gateways this currently fits
      // our usecases but we should probably include `gateway | sidecar` or
      // similar
      const search = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))
      if (typeof search.tag === 'undefined') {
        search.tag = []
      }
      search.tag = search.tag.filter((item) => !item.startsWith('kuma.io/service:'))
      search.tag.push(`kuma.io/service:${params.service}`)

      return api.getAllDataplaneOverviewsFromMesh({
        mesh: params.mesh,
      }, {
        offset,
        ...search,
        ...(
          params.type !== 'all' && {
            gateway: params.type,
          }
        ),
        size: params.size,
      })
    },

  }
}
