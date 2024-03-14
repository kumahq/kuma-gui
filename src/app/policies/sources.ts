import { Policy, PolicyDataplane } from './data'
import type { PolicyType } from './data'
import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type PolicyCollection = CollectionResponse<Policy>
export type PolicySource = DataSourceResponse<Policy>
export type PolicyTypeCollectionSource = DataSourceResponse<{ policies: PolicyType[] }>
export type PolicyCollectionSource = DataSourceResponse<PolicyCollection>

export type PolicyDataplaneCollection = CollectionResponse<PolicyDataplane>
export type PolicyDataplaneSource = DataSourceResponse<PolicyDataplane>
export type PolicyDataplaneCollectionSource = DataSourceResponse<PolicyDataplaneCollection>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/*/policy-types': () => {
      return api.getPolicyTypes()
    },

    '/meshes/:mesh/policy-path/:path': async (params) => {
      const { mesh, path, size } = params
      const offset = params.size * (params.page - 1)

      return Policy.fromCollection(await api.getAllPolicyEntitiesFromMesh({ mesh, path }, { offset, size }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name': async (params) => {
      const { mesh, path, name } = params

      return Policy.fromObject(await api.getSinglePolicyEntity({ mesh, path, name }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes': async (params) => {
      const { mesh, path, name } = params

      return PolicyDataplane.fromCollection(await api.getPolicyConnections({ mesh, path, name }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes': (params) => {
      const { mesh, path, name } = params

      return api.getSinglePolicyEntity({ mesh, path, name }, { format: 'kubernetes' })
    },
  })
}
