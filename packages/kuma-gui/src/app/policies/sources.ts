import createClient from 'openapi-fetch'

import { Policy, PolicyDataplane, PolicyResourceType } from './data'
import { DataplanePolicies } from './data/DataplanePolicies'
import { DataplaneInboundPolicies, DataplaneOutboundPolicies } from './data/DataplaneTrafficPolicies'
import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { paths } from '@kumahq/kuma-http-api'

export type PolicyCollection = CollectionResponse<Policy>
export type PolicySource = DataSourceResponse<Policy>
export type PolicyCollectionSource = DataSourceResponse<PolicyCollection>

export type PolicyDataplaneCollection = CollectionResponse<PolicyDataplane>
export type PolicyDataplaneSource = DataSourceResponse<PolicyDataplane>
export type PolicyDataplaneCollectionSource = DataSourceResponse<PolicyDataplaneCollection>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })

  return defineSources({
    '/policy-types': async () => {
      const res = await http.GET('/_resources')

      return PolicyResourceType.fromCollection(res.data!)
    },
    
    '/meshes/:mesh/policy-path/:path': async (params) => {
      const { mesh, path, size } = params
      const offset = params.size * (params.page - 1)

      const search = Policy.search(params.search)

      return Policy.fromCollection(await api.getAllPolicyEntitiesFromMesh({ mesh, path }, { offset, size, ...search }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name': async (params) => {
      const { mesh, path, name } = params

      return Policy.fromObject(await api.getSinglePolicyEntity({ mesh, path, name }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes': async (params) => {
      const { mesh, path, name, size } = params
      const offset = params.size * (params.page - 1)
      return PolicyDataplane.fromCollection(await api.getPolicyConnections({ mesh, path, name }, { offset, size }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes': (params) => {
      const { mesh, path, name } = params

      return api.getSinglePolicyEntity({ mesh, path, name }, { format: 'kubernetes' })
    },
        
    '/meshes/:mesh/dataplanes/:name/policies/for/proxy': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/_policies', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return DataplanePolicies.fromCollection(res.data!)
    },
        
    '/meshes/:mesh/dataplanes/:name/policies/for/inbound/:kri': async (params) => {
      const { mesh, name, kri } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/_inbounds/{inbound-kri}/_policies', {
        params: {
          path: {
            mesh,
            name,
            'inbound-kri': kri,
          },
        },
      })
      return DataplaneInboundPolicies.fromCollection(res.data!)
    },
    
    '/meshes/:mesh/dataplanes/:name/policies/for/outbound/:kri': async (params) => {
      const { mesh, name, kri } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/_outbounds/{kri}/_policies', {
        params: {
          path: {
            mesh,
            name,
            kri,
          },
        },
      })
      return DataplaneOutboundPolicies.fromCollection(res.data!)
    },
  })
}
