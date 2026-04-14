import createClient from 'openapi-fetch'

import { MeshTrust } from './data'
import type { KumaMeshTrust } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
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
  
      const res = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: mtrust,
          },
        },
      })
  
      return MeshTrust.fromObject(res.data as KumaMeshTrust)
    },

    '/meshtrusts/:mtrust/as/kubernetes': async (params) => {
      const { mtrust } = params
  
      const res = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri: mtrust,
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
