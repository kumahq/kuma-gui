import createClient from 'openapi-fetch'

import { Policy, PolicyDataplane, PolicyResourceType } from './data'
import { Kri } from '../kuma'
import type { KumaPolicy, KumaPolicyCollection, DynamicPath } from './data'
import { DataplanePolicies } from './data/DataplanePolicies'
import { DataplaneInboundPolicies, DataplaneOutboundPolicies } from './data/DataplaneTrafficPolicies'
import type { DataSourceResponse } from '@/app/application'
import { defineSources, YAML } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'

export type PolicySource = DataSourceResponse<Policy>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
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
      const res = await http.GET(`/meshes/{mesh}/${path as DynamicPath}`, {
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

      return Policy.fromCollection(res.data as KumaPolicyCollection)
    },

    '/meshes/:mesh/policy-path/:path/policy/:name': async (params) => {
      const { mesh, path, name } = params
      if (Kri.isKriString(name)) {
        const res = await http.GET('/_kri/{kri}', {
          params: {
            path: {
              kri: name,
            },
          },
        })
        return Policy.fromObject(res.data as KumaPolicy)
      } else {
        const res = await http.GET(`/meshes/{mesh}/${path as DynamicPath}/{name}`, {
          params: {
            path: {
              mesh,
              name,
            },
          },
        })
        return Policy.fromObject(res.data as KumaPolicy)
      }
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes': async (params) => {
      const { mesh, path, name } = params
      const res = await http.GET(`/meshes/{mesh}/${path as DynamicPath}/{name}`, {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-expect-error - query parameter not listed in OAS
          query: {
            format: 'kubernetes',
          },
        },
      })
      return YAML.stringify(res.data)
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes': async (params) => {
      const { mesh, path, name, size } = params
      const offset = params.size * (params.page - 1)
      const res = await http.GET('/meshes/{mesh}/{policyType}/{policyName}/_resources/dataplanes', {
        params: {
          path: {
            mesh,
            policyType: path,
            policyName: name,
          },
          query: {
            size,
            offset,
          },
        },
      })
      return PolicyDataplane.fromCollection(res.data! as unknown as CollectionResponse<PartialPolicyDataplane>)
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
