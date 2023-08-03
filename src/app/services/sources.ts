import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ExternalService, ServiceInsight } from '@/types/index.d'

type CollectionParams = {
  mesh: string
}

type DetailParams = CollectionParams & {
  name: string
}

type PaginationParams = {
  size: number
  page: number
}

type Closeable = { close: () => void }

export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export type ExternalServiceSource = DataSourceResponse<ExternalService>

export const sources = (api: KumaApi) => {
  return {
    '/:mesh/service-insights': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const mesh = params.mesh
      const size = params.size
      const offset = params.size * (params.page - 1)

      return api.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    },

    '/:mesh/service-insights/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const mesh = params.mesh
      const name = params.name

      return api.getServiceInsight({ mesh, name })
    },

    '/:mesh/external-services/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const mesh = params.mesh
      const name = params.name

      return api.getExternalServiceByServiceInsightName(mesh, name)
    },
  }
}
