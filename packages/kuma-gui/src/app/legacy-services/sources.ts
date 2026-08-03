import createClient from 'openapi-fetch'

import { ExternalService, ServiceInsight } from './data'
import { defineSources } from '@/app/application'
import type { DataSourceResponse } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ServiceInsightsParameters } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
  ServiceInsight as PartialServiceInsight} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { ExternalService } from './data/ExternalService'

export type ServiceInsightSource = DataSourceResponse<ServiceInsight>
export type ServiceInsightCollection = CollectionResponse<ServiceInsight>
export type ServiceInsightCollectionSource = DataSourceResponse<ServiceInsightCollection>

export type ExternalServiceSource = DataSourceResponse<ExternalService | null>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/external-services': async (params) => {
      const { mesh, size, page } = params
      const offset = size * (page - 1)

      const search = ExternalService.search(params.search)

      const res = await http.GET('/meshes/{mesh}/external-services', {
        params: {
          path: {
            mesh,
          },
          query: {
            size,
            offset,
            ...search,
          },
        },
      })
      return ExternalService.fromCollection(res.data! as unknown as CollectionResponse<PartialExternalService>)
    },

    '/meshes/:mesh/external-services/:name': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/external-services/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })

      return ExternalService.fromObject(res.data! as unknown as PartialExternalService)
    },

    '/meshes/:mesh/external-services/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/external-services/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data!
    },

    '/meshes/:mesh/service-insights/of/:serviceType': async (params) => {
      const { mesh, size, serviceType } = params
      const offset = params.size * (params.page - 1)

      const search = ServiceInsight.search(params.search)
      const filterParams: ServiceInsightsParameters = {
        size,
        offset,
        ...search,
      }

      if (serviceType !== 'all') {
        filterParams.type = serviceType
      }

      const res = await http.GET('/meshes/{mesh}/service-insights', {
        params: {
          path: {
            mesh,
          },
          query: {
            ...filterParams,
          },
        },
      })
      return ServiceInsight.fromCollection(res.data! as unknown as CollectionResponse<PartialServiceInsight>)
    },

    '/meshes/:mesh/service-insights/:name': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/service-insights/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })

      return ServiceInsight.fromObject(res.data! as unknown as PartialServiceInsight)
    },
  })
}
