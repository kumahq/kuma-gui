import { ExternalService, ServiceInsight } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ServiceInsightsParameters } from '@/types/api.d'

export type { ServiceInsight } from './data'

export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export type ExternalServiceSource = DataSourceResponse<ExternalService | null>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/service-insights/of/:serviceType': async (params) => {
      const { mesh, size, serviceType } = params
      const offset = params.size * (params.page - 1)

      const filterParams: ServiceInsightsParameters = {
        size,
        offset,
      }

      // NOTE: The syntax for this isn’t final and the query parameter for it not implemented yet (see https://github.com/kumahq/kuma/issues/9109).
      if (serviceType !== 'all') {
        filterParams.serviceType = serviceType
      }

      return ServiceInsight.fromCollection(await api.getAllServiceInsightsFromMesh({ mesh }, filterParams))
    },

    '/meshes/:mesh/service-insights/:name': async (params) => {
      const { mesh, name } = params

      return ServiceInsight.fromObject(await api.getServiceInsight({ mesh, name }))
    },

    // TODO: Remove this when removing external services from the Services tab.
    '/meshes/:mesh/external-services/for/:service': async (params) => {
      const { mesh, service } = params

      const { items } = await api.getAllExternalServicesFromMesh({ mesh }, {
        tag: [`kuma.io/service:${service}`],
      })

      return items.length > 0 ? ExternalService.fromObject(items[0]) : null
    },

    // TODO: Remove this when removing external services from the Services tab.
    '/meshes/:mesh/external-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getExternalService({ mesh, name }, {
        format: 'kubernetes',
      })
    },
  })
}
