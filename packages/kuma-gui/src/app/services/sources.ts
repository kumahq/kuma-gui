import createClient from 'openapi-fetch'

import {
  MeshService,
  MeshMultiZoneService,
  MeshExternalService,
  Hostname,
} from './data'
import type { KumaMeshService, KumaMeshMultiZoneService, KumaMeshExternalService } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'


const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })

  return defineSources({
    '/meshes/:mesh/mesh-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const search = MeshService.search(params.search)

      const res = await http.GET('/meshes/{mesh}/meshservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
            ...search,
          },
        },
      })

      return MeshService.fromCollection(res.data!)
    },

    '/mesh-service/:kri': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
        },
      })

      return MeshService.fromObject(response.data! as KumaMeshService)
    },

    '/mesh-service/:kri/as/kubernetes': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
          // @ts-expect-error - type not in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })

      return response.data!
    },

    '/meshes/:mesh/mesh-multi-zone-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const search = MeshMultiZoneService.search(params.search)

      const res = await http.GET('/meshes/{mesh}/meshmultizoneservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
            ...search,
          },
        },
      })

      return MeshMultiZoneService.fromCollection(res.data!)
    },

    '/mesh-multi-zone-service/:kri': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
        },
      })

      return MeshMultiZoneService.fromObject(response.data! as KumaMeshMultiZoneService)
    },

    '/mesh-multi-zone-service/:kri/as/kubernetes': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
          // @ts-expect-error - type not in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })

      return response.data!
    },

    '/meshes/:mesh/mesh-external-services': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      const search = MeshExternalService.search(params.search)

      const res = await http.GET('/meshes/{mesh}/meshexternalservices', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
            ...search,
          },
        },
      })
      return MeshExternalService.fromCollection(res.data!)
    },

    '/mesh-external-service/:kri': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
        },
      })

      return MeshExternalService.fromObject(response.data! as KumaMeshExternalService)
    },

    '/mesh-external-service/:kri/as/kubernetes': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
          // @ts-expect-error - type not in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })
      
      return response.data!
    },

    '/meshes/:mesh/:serviceType/:serviceName/_hostnames': async (params) => {
      const { mesh, serviceType, serviceName } = params
      const isValidServiceType = includes(['meshservices', 'meshexternalservices', 'meshmultizoneservices'] as const, serviceType)

      if(!isValidServiceType) {
        throw new Error(`Incorrect value for :serviceType, got ${serviceType}.`)
      }

      const response = await http.GET('/meshes/{mesh}/{serviceType}/{serviceName}/_hostnames', {
        params: {
          path: {
            mesh,
            serviceType,
            serviceName,
          },
        },
      })

      return Hostname.fromCollection(response.data!)
    },
  })
}
