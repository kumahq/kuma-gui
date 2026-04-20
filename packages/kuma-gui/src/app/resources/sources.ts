import createClient from 'openapi-fetch'

import { Resource, ResourceTypeDescriptor } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

type DynamicPathGlobal = 'hostnamegenerators'
type DynamicPathMesh = 'meshaccesslogs'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/resource-type-descriptors': async () => {
      const response = await http.GET('/_resources')

      const normalized = ResourceTypeDescriptor.fromCollection(response.data!)
      return {
        ...normalized,
        resources: normalized.resources.filter((resource) => {
          return ['insight', 'secret'].every((excluded) => !resource.name.toLowerCase().includes(excluded))
        }),
      }
    },

    '/resources/:path': async (params) => {
      const { path, size } = params
      const offset = params.size * (params.page - 1)
      const search = Resource.search(params.search)

      const response = await http.GET(`/${path as DynamicPathGlobal}`, {
        params: {
          query: {
            size,
            offset,
            ...search,
          },
        },
      })

      return Resource.fromCollection(response.data!)
    },

    '/resources/:path/for/:mesh': async (params) => {
      const { mesh, path, size } = params
      const offset = params.size * (params.page - 1)
      const search = Resource.search(params.search)
      
      const response = await http.GET(`/meshes/{mesh}/${path as DynamicPathMesh}`, {
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

      return Resource.fromCollection(response.data!)
    },

    '/resource/:kri': async (params) => {
      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: params.kri,
          },
        },
      })

      return Resource.fromObject(response.data!)
    },

    '/resource/:kri/as/kubernetes': async (params) => {
      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: params.kri,
          },
        },
        query: {
          format: 'kubernetes',
        },
      })

      return response.data!
    },
  })
}
