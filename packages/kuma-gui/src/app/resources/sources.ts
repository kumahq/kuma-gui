import createClient from 'openapi-fetch'

import { MeshIdentity } from './data/MeshIdentity'
import { defineSources } from '@/app/application'
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

    '/meshes/:mesh/meshidentities/:name': async (params) => {
      const { mesh, name } = params
  
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

    '/meshes/:mesh/meshidentities/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
  
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
  
      return MeshIdentity.fromObject(res.data!)
    },
  })
}
