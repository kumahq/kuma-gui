import createClient from 'openapi-fetch'

import { Mesh, MeshInsight } from './data'
import { defineSources } from '@/app/application'
import type { paths } from '@kumahq/kuma-http-api'

type Options = {
  baseUrl: string
  fetch: typeof fetch
}
export const sources = ({ baseUrl, fetch }: Options) => {
  const http = createClient<paths>({
    baseUrl,
    fetch,
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
      const offset = String(params.size * (params.page - 1))
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
