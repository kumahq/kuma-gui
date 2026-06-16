import createClient from 'openapi-fetch'

import { ExternalService } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { ExternalService } from './data'

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
          // @ts-ignore this needs to accept &tag=...&tag...
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
  })
}
