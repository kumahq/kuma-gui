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
  // page: number
  // size: number
  offset: number
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
      source.close()
      return api.getPolicyTypes()
    },
    '/:mesh/policy-type/:policyType': async (params: MeshParams & PolicyTypeParams & PaginationParams, source: {close: () => void}) => {
      source.close()
      return api.getAllPolicyEntitiesFromMesh({ mesh: params.mesh, path: params.policyType }, { offset: params.offset })
    },
    // '/:mesh/policy/:policy': async (params: MeshParams & PolicyParams) => {
    // },
  }
}
