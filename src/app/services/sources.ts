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

type ExternalServiceParams = CollectionParams & {
  service: string
}

type PaginationParams = {
  size: number
  page: number
}

type Closeable = { close: () => void }

export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export type ExternalServiceSource = DataSourceResponse<ExternalService | null>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/service-insights': (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return api.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    },

    '/meshes/:mesh/service-insights/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getServiceInsight({ mesh, name })
    },

    '/meshes/:mesh/external-services/for/:service': async (params: ExternalServiceParams, source: Closeable) => {
      source.close()

      const { mesh, service } = params

      const { items } = await api.getExternalServicesByServiceInsightName({ mesh, service })

      return items.length > 0 ? items[0] : null
    },
  }
}
