import createClient from 'openapi-fetch'

import { Mesh, MeshInsight } from './data'
import { defineSources } from '../application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:name': async (params) => {
      const { name } = params

      const res = await http.GET('/meshes/{name}', {
        params: {
          path: {
            name,
          },
        },
      })

      return Mesh.fromObject(res.data!)
    },

    '/meshes/:name/as/kubernetes': async (params) => {
      const { name } = params
      const res = await http.GET('/meshes/{name}', {
        params: {
          path: {
            name,
          },
          // @ts-ignore
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data!
    },

    '/mesh-insights': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)
      const search = MeshInsight.search(params.search)

      const res = await http.GET('/mesh-insights', {
        params: {
          query: {
            size,
            offset,
            ...search,
          },
        },
      })

      return MeshInsight.fromCollection(res.data!)
    },

    '/mesh-insights/:name': async (params) => {
      const { name } = params

      const res = await http.GET('/mesh-insights/{name}', {
        params: {
          path: {
            name,
          },
        },
      })
      return MeshInsight.fromObject(res.data!)
    },
  })
}
