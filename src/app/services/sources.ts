import { ExternalService, ServiceInsight } from './data'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type { ExternalService, ServiceInsight } from './data'

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
    '/meshes/:mesh/service-insights': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return ServiceInsight.fromCollection(await api.getAllServiceInsightsFromMesh({ mesh }, { size, offset }))
    },

    '/meshes/:mesh/service-insights/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return ServiceInsight.fromObject(await api.getServiceInsight({ mesh, name }))
    },

    '/meshes/:mesh/external-services/for/:service': async (params: ExternalServiceParams, source: Closeable) => {
      source.close()

      const { mesh, service } = params

      const { items } = await api.getAllExternalServicesFromMesh({ mesh }, {
        tag: [`kuma.io/service:${service}`],
      })

      return items.length > 0 ? ExternalService.fromObject(items[0]) : null
    },

    '/meshes/:mesh/external-service/:name/as/kubernetes': async (params: CollectionParams & { name: string }) => {
      const { mesh, name } = params
      return api.getExternalService({ mesh, name }, {
        format: 'kubernetes',
      })
    },
  }
}
