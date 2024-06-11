import { MeshService, MeshExternalService, ExternalService, ServiceInsight } from './data'
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
    '/meshes/:mesh/mesh-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return MeshService.fromCollection(await api.getAllMeshServicesFromMesh({ mesh }, { size, offset }))
    },

    '/meshes/:mesh/mesh-service/:name': async (params) => {
      const { mesh, name } = params

      return MeshService.fromObject(await api.getMeshService({ mesh, name }))
    },

    '/meshes/:mesh/mesh-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getMeshService({ mesh, name }, {
        format: 'kubernetes',
      })
    },

    '/meshes/:mesh/mesh-external-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return MeshExternalService.fromCollection(await api.getAllMeshExternalServicesFromMesh({ mesh }, { size, offset }))
    },

    '/meshes/:mesh/mesh-external-service/:name': async (params) => {
      const { mesh, name } = params

      return MeshExternalService.fromObject(await api.getMeshExternalService({ mesh, name }))
    },

    '/meshes/:mesh/mesh-external-service/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getMeshExternalService({ mesh, name }, {
        format: 'kubernetes',
      })
    },

    '/meshes/:mesh/service-insights/of/:serviceType': async (params) => {
      const { mesh, size, serviceType } = params
      const offset = params.size * (params.page - 1)

      const filterParams: ServiceInsightsParameters = {
        size,
        offset,
      }

      if (serviceType !== 'all') {
        filterParams.type = serviceType
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
