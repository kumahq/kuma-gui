import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { DataPlaneOverview as DataplaneOverview } from '@/types/index.d'
import { normalizeFilterFields } from '@/utilities/normalizeFilterFields'

type CollectionParams = {
  mesh: string
}

type DetailParams = CollectionParams & {
  name: string
}

type PaginationParams = {
  size: number
  page: number
  search: string
}

type ServiceParams = {
  service: string
}

type DataplaneTypeParams = {
  type: 'all' | 'delegated' | 'builtin'
}

type Closeable = { close: () => void }

export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataPlaneCollection = CollectionResponse<DataplaneOverview>
export type DataPlaneCollectionSource = DataSourceResponse<DataPlaneCollection>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/dataplanes': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)
      const gateway = 'false'
      const filterParams = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        gateway,
        offset,
        size,
      })
    },

    '/meshes/:mesh/dataplane-overviews/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getDataplaneOverviewFromMesh({ mesh, name })
    },

    '/meshes/:mesh/dataplanes/for/:service/of/:type': async (params: CollectionParams & ServiceParams & PaginationParams & DataplaneTypeParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      // here 'all' means both proxies/sidecars and gateways this currently fits
      // our usecases but we should probably include `gateway | sidecar` or
      // similar
      const filterParams = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))
      if (typeof filterParams.tag === 'undefined') {
        filterParams.tag = []
      }
      filterParams.tag = filterParams.tag.filter((item) => !item.startsWith('kuma.io/service:'))
      filterParams.tag.push(`kuma.io/service:${params.service}`)
      const gatewayParams = params.type !== 'all' ? { gateway: params.type } : {}

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        ...gatewayParams,
        offset,
        size,
      })
    },
  }
}
