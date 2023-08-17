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

export type ExternalServiceSource = DataSourceResponse<ExternalService>
export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/service-insights': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return api.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    },

    '/meshes/:mesh/service-insights/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getServiceInsight({ mesh, name })
    },

    '/meshes/:mesh/external-services/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getExternalServiceByServiceInsightName(mesh, name)
    },
  }
}
