import createClient from 'openapi-fetch'

import { Resource, ResourceTypeDescriptor, type ResourceTypeDescriptorCollection } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'
import { Kri, useDataSource } from '../kuma'

type DynamicPathGlobal = 'hostnamegenerators'
type DynamicPathMesh = 'meshaccesslogs'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
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
      const { kri } = params
      const { shortName, mesh, name } = Kri.fromString(kri)

      if(shortName.startsWith('~')) {
        const fetch = useDataSource()
        const resources = await fetch<ResourceTypeDescriptorCollection>('/resource-type-descriptors')
        const path = resources.resources.find((resource) => shortName.includes(resource.name.toLowerCase()))?.path
        if(mesh.length > 0) {
          return await fetch<ReturnType<typeof Resource.fromObject>>(`/resource/${path}/${name}/for/${mesh}`)
        }
        return await fetch<ReturnType<typeof Resource.fromObject>>(`/resource/${path}/${name}`)
      }

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
        },
      })

      return Resource.fromObject(response.data!)
    },

    '/resource/:kri/as/kubernetes': async (params) => {
      const { kri } = params
      const { shortName, mesh, name } = Kri.fromString(kri)

      if(shortName.startsWith('~')) {
        const fetch = useDataSource()
        const resources = await fetch<ResourceTypeDescriptorCollection>('/resource-type-descriptors')
        const path = resources.resources.find((resource) => shortName.includes(resource.name.toLowerCase()))?.path
        if(mesh.length > 0) {
          return await fetch<unknown>(`/resource/${path}/${name}/for/${mesh}/as/kubernetes`)
        }
        return await fetch<unknown>(`/resource/${path}/${name}/as/kubernetes`)
      }

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: params.kri,
          },
          // @ts-expect-error - query parameter not listed in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })

      return response.data!
    },

    '/resource/:path/:name': async (params) => {
      const { path, name } = params

      const response = await http.GET(`/${path as DynamicPathGlobal}/{name}`, {
        params: {
          path: {
            name,
          },
        },
      })
      return Resource.fromObject(response.data!)
    },

    '/resource/:path/:name/for/:mesh': async (params) => {
      const { mesh, path, name } = params
      
      const response = await http.GET(`/meshes/{mesh}/${path as DynamicPathMesh}/{name}`, {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return Resource.fromObject(response.data!)
    },

    '/resource/:path/:name/as/kubernetes': async (params) => {
      const { path, name } = params

      const response = await http.GET(`/${path as DynamicPathGlobal}/{name}`, {
        params: {
          path: {
            name,
          },
          // @ts-expect-error - query parameter not listed in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })
      return response.data!
    },

    '/resource/:path/:name/for/:mesh/as/kubernetes': async (params) => {
      const { mesh, path, name } = params
      
      const response = await http.GET(`/meshes/{mesh}/${path as DynamicPathMesh}/{name}`, {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-expect-error - query parameter not listed in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })
      return response.data!
    },
  })
}
