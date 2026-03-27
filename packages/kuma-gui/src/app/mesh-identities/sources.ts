import createClient from 'openapi-fetch'

import { MeshIdentity } from './data/MeshIdentity'
import type { KumaMeshIdentity } from './data/MeshIdentity'
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

    '/meshidentities/:mid': async (params) => {
      const { mid } = params
  
      const res = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: mid,
          },
        },
      })
  
      return MeshIdentity.fromObject(res.data as KumaMeshIdentity)
    },

    '/meshidentities/:mid/as/kubernetes': async (params) => {
      const { mid } = params
  
      const res = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: mid,
          },
          // @ts-ignore
          query: {
            format: 'kubernetes',
          },
        },
      })
  
      return res.data
    },
  })
}
