import createClient from 'openapi-fetch'

import { MeshZoneAddress } from './data'
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
    '/mesh-zone-addresses/for/mesh/:mesh': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)
      const search = MeshZoneAddress.search(params.search)

      const res = await http.GET('/meshes/{mesh}/meshzoneaddresses', {
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

      return MeshZoneAddress.fromCollection(res.data!)
    },
  })
}
