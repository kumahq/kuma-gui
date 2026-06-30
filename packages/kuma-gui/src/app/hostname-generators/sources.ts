import createClient from 'openapi-fetch'

import { HostnameGenerator } from './data/HostnameGenerator'
import type { KumaHostnameGenerator } from './data/HostnameGenerator'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })

  return defineSources({
    '/hostname-generators': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      const search = HostnameGenerator.search(params.search)

      const res = await http.GET('/hostnamegenerators', {
        params: {
          query: {
            offset,
            size,
            ...search,
          },
        },
      })

      return HostnameGenerator.fromCollection(res.data!)
    },

    '/hostname-generators/:kri': async (params) => {
      const { kri } = params

      const  response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
        },
      })

      return HostnameGenerator.fromObject(response.data as KumaHostnameGenerator)
    },

    '/hostname-generators/:kri/as/kubernetes': async (params) => {
      const { kri } = params

      const response = await http.GET('/_kri/{kri}', {
        params: {
          path: {
            kri,
          },
          // @ts-expect-error - query type missing in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })

      return response.data!
    },
  })
}
