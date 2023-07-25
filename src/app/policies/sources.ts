import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PaginatedApiListResponse as CollectionResponse,
} from '@/types/api.d'
import type {
  PolicyEntity as Policy,
  PolicyType,
} from '@/types/index.d'

type MeshParams = {
  mesh: string
}
type PaginationParams = {
  page: number
  size: number
}

type PolicyTypeParams = {
  policyType: string
}
// type PolicyParams = {
//   policy: string
// }
export type PolicyCollection = CollectionResponse<Policy>
export type PolicySource = DataSourceResponse<Policy>
export type PolicyTypeCollectionSource = DataSourceResponse<{policies: PolicyType[]}>
export type PolicyCollectionSource = DataSourceResponse<PolicyCollection>

export const sources = (api: KumaApi) => {
  return {
    '/*/policy-types': async (_params: {}, source: {close: () => void}) => {
      const res = await api.getPolicyTypes()
      source.close()
      return res
    },
    '/:mesh/policy-type/:policyType': async (params: MeshParams & PolicyTypeParams & PaginationParams, source: {close: () => void}) => {
      const offset = params.size * (params.page - 1)
      const res = await api.getAllPolicyEntitiesFromMesh({
        mesh: params.mesh,
        path: params.policyType,
      }, {
        offset,
        size: params.size,
      })
      source.close()
      return res
    },
    // '/:mesh/policy/:policy': async (params: MeshParams & PolicyParams) => {
    // },
  }
}
