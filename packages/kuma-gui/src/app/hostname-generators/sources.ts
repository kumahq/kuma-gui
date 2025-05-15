import createClient from 'openapi-fetch'

import { HostnameGenerator } from './data/HostnameGenerator'
import { defineSources } from '../application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
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

    '/hostname-generators/:name': async (params) => {
      const { name } = params

      const res = await http.GET('/hostnamegenerators/{name}', {
        params: {
          path: {
            name,
          },
        },
      })

      return HostnameGenerator.fromObject(res.data!)
    },

    '/hostname-generators/:name/as/kubernetes': async (params) => {
      const { name } = params

      const res = await http.GET('/hostnamegenerators/{name}', {
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
  })
}
