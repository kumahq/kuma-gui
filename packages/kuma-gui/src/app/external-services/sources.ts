import createClient from 'openapi-fetch'

import { ExternalService } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ExternalServicesParameters } from '@/types/api.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { ExternalService } from './data'

export type ExternalServiceSource = DataSourceResponse<ExternalService>
export type ExternalServiceCollection = CollectionResponse<ExternalService>
export type ExternalServiceCollectionSource = DataSourceResponse<ExternalServiceCollection>

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
          }
        },
      })
      return ExternalService.fromCollection(res.data!)
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

      return ExternalService.fromObject(res.data!)
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
  })
}
