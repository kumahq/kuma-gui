import createClient from 'openapi-fetch'

import { Resource } from './data'
import { Resources } from './data/Resources'
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
    '/resources': async (params) => {
      const search = Resource.parseSearch(params.search, { defaultKey: 'category' })
      const response = await http.GET('/_resources')

      const normalized = ResourcesTypes.fromCollection(response.data!)

      return !search.category ? normalized : {
        ...normalized,
        resources: normalized.resources.filter((resource) => {
          return resource.categories.includes(search.category as string)
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
