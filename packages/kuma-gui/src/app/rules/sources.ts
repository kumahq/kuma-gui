import createClient from 'openapi-fetch'

import {
  Rule,
} from './data'
import { defineSources } from '@/app/application'
import { useFetch } from '@/app/kuma'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { KumaResourceTypeDescriptorCollection } from '@/app/resources/data'
import type { paths } from '@kumahq/kuma-http-api'

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/rules/for/:dataplane': async (params) => {
      const fetch = useFetch()
      const resources = await fetch<KumaResourceTypeDescriptorCollection>('/resource-type-descriptors')
      const res = await http.GET('/meshes/{mesh}/{resourceType}/{resourceName}/_rules', {
        params: {
          path: {
            mesh: params.mesh,
            resourceType: 'dataplanes',
            resourceName: params.dataplane,
          },
        },
      })
      return Rule.fromCollection(res.data!, resources)
    },
  })
}
