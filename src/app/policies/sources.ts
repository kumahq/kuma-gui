import { DataSourceResponse } from '@/app/application/services/data-source/DataSource'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  PolicyEntity as Policy,
  PolicyType,
} from '@/types/index.d'
export interface CollectionResponse<T = Record<string, unknown>> {
  total: number,
  items: T[]
  next: string | null
}

type MeshParams = {
  mesh: string
}
type PaginationParams = {
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
