import createClient from 'openapi-fetch'

import { Resource, Resources } from './data'
import { ResourcesTypes } from './data/ResourceTypes'
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
    '/resources': async () => {
      const response = await http.GET('/_resources')

      return ResourcesTypes.fromCollection(response.data!)
    },

    '/resources/by/:category': async (params) => {
      const { category } = params
      const response = await http.GET('/_resources')

      const normalized = ResourcesTypes.fromCollection(response.data!)

      if(category === 'all') {
        return normalized
      }

      return {
        ...normalized,
        resources: normalized.resources.filter((resource) => {
          return resource.categories.includes(category)
        }),
      }
    },

    '/resources/:path': async (params) => {
      const { path } = params
      const search = Resource.search(params.search)

      const response = await http.GET(`/${path as DynamicPathGlobal}`, {
        params: {
          // @ts-expect-error - incorrect typing in openapi-fetch
          query: {
            ...search,
          },
        },
      })

      return Resources.fromCollection(response.data!)
    },

    '/resources/:path/for/:mesh': async (params) => {
      const { mesh, path } = params
      const search = Resource.search(params.search)
      
      const response = await http.GET(`/meshes/{mesh}/${path as DynamicPathMesh}`, {
        params: {
          path: {
            mesh,
          },
          // @ts-expect-error - incorrect typing in openapi-fetch
          query: {
            ...search,
          },
        },
      })

      return Resources.fromCollection(response.data!)
    },

    '/resource/:kri': async (params) => {
      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: params.kri,
          },
        },
      })

      return Resources.fromObject(response.data!)
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
