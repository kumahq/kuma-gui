import createClient from 'openapi-fetch'

import { Workload, type KumaWorkloadItem } from './data'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/workloads': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const res = await http.GET('/meshes/{mesh}/workloads', {
        params: {
          path: {
            mesh,
          },
        },
        query: {
          size,
          offset,
        },
      })

      return Workload.fromCollection(res.data!)
    },

    '/workloads/:wl': async (params) => {
      const { wl } = params

      const res = await http.GET('/_kri/{kri}', {
        params: { path: { kri: wl } },
      })

      return Workload.fromObject(res.data as KumaWorkloadItem)
    },

    '/workloads/:wl/as/kubernetes': async (params) => {
      const { wl } = params

      const res = await http.GET('/_kri/{kri}', {
        params: {
          path: { 
            kri: wl, 
          },
          // @ts-expect-error -- query type is not defined in openapi spec --
          query: {
            format: 'kubernetes',
          },
        },
      })

      return res.data
    },
  })
}
