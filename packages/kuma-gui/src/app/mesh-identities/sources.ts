import createClient from 'openapi-fetch'

import { MeshIdentity } from './data'
import { defineSources } from '@/app/application'
import type { paths, components } from '@kumahq/kuma-http-api'

type KumaMeshIdentity = components['schemas']['MeshIdentityItem']

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
