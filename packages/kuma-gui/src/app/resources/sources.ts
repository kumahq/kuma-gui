import createClient from 'openapi-fetch'

import { MeshIdentity } from './data/MeshIdentity'
import { MeshTrust } from './data/MeshTrust'
import { defineSources } from '@/app/application'
import { Kri } from '@/app/kuma/kri'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/meshidentities': async (params) => {
      const { mesh } = params
  
      const res = await http.GET('/meshes/{mesh}/meshidentities', {
        params: {
          path: {
            mesh,
          },
        },
      })
  
      return MeshIdentity.fromCollection(res.data!)
    },

    '/meshidentities/:mid': async (params) => {
      const { mid } = params
      const { mesh = '', name = '' } = Kri.fromString(mid)
  
      const res = await http.GET('/meshes/{mesh}/meshidentities/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
  
      return MeshIdentity.fromObject(res.data!)
    },

    '/meshidentities/:mid/as/kubernetes': async (params) => {
      const { mid } = params
      const { mesh = '', name = '' } = Kri.fromString(mid)
  
      const res = await http.GET('/meshes/{mesh}/meshidentities/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-ignore
          query: {
            format: 'kubernetes',
          },
        },
      })
  
      return res.data
    },

    '/meshes/:mesh/meshtrusts': async (params) => {
      const { mesh } = params
  
      const res = await http.GET('/meshes/{mesh}/meshtrusts', {
        params: {
          path: {
            mesh,
          },
        },
      })
  
      return MeshTrust.fromCollection(res.data!)
    },

    '/meshtrusts/:mtrust': async (params) => {
      const { mtrust } = params
      const { mesh = '', name = '' } = Kri.fromString(mtrust)
  
      const res = await http.GET('/meshes/{mesh}/meshtrusts/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
  
      return MeshTrust.fromObject(res.data!)
    },

    '/meshtrusts/:mtrust/as/kubernetes': async (params) => {
      const { mtrust } = params
      const { mesh = '', name = '' } = Kri.fromString(mtrust)
  
      const res = await http.GET('/meshes/{mesh}/meshtrusts/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-ignore
          query: {
            format: 'kubernetes',
          },
        },
      })
  
      return res.data
    },

    // '/kri/:kri': async (params) => {
    //   const { kri } = params
    //   const res = await http.GET('/_kri/{kri}', {
    //     params: {
    //       path: {
    //         kri,
    //       },
    //     },
    //   })

    //   switch(true) {
    //     case res.data!.type === 'Mesh': {
    //       return Mesh.fromObject(res.data)
    //     }
    //     case res.data!.type === 'Dataplane': {
    //       return Dataplane.fromObject(res.data as Dataplane)
    //     }
    //     default:
    //       return res.data!
    //   }
    // }
  })
}
