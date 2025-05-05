import { ExternalService } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ExternalServicesParameters } from '@/types/api.d'

export type { ExternalService } from './data'

export type ExternalServiceSource = DataSourceResponse<ExternalService>
export type ExternalServiceCollection = CollectionResponse<ExternalService>
export type ExternalServiceCollectionSource = DataSourceResponse<ExternalServiceCollection>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/external-services': async (params) => {
      const { mesh, size, page, search } = params
      const offset = size * (page - 1)

      const filterParams: ExternalServicesParameters = {
        size,
        offset,
        ...ExternalService.search(search),
      }

      return ExternalService.fromCollection(await api.getAllExternalServicesFromMesh({ mesh }, filterParams))
    },

    '/meshes/:mesh/external-services/:name': async (params) => {
      const { mesh, name } = params

      return ExternalService.fromObject(await api.getExternalService({ mesh, name }))
    },

    '/meshes/:mesh/external-services/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getExternalService({ mesh, name }, {
        format: 'kubernetes',
      })
    },
  })
}
