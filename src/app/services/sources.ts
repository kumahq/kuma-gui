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

export type ServiceSource = DataSourceResponse<{ serviceInsight: ServiceInsight, externalService: ExternalService | null }>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/services': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return api.getAllServiceInsightsFromMesh({ mesh }, { size, offset })
    },

    '/meshes/:mesh/services/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      const serviceInsight = await api.getServiceInsight({ mesh, name })
      let externalService: ExternalService | null = null
      if (serviceInsight.serviceType === 'external') {
        externalService = await api.getExternalServiceByServiceInsightName(mesh, name)
      }

      return { serviceInsight, externalService }
    },
  }
}
