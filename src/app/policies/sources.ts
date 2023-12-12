import { Policy, PolicyDataplane } from './data'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { PolicyType } from '@/types/index.d'

type CollectionParams = {
  mesh: string
  path: string
}

type DetailParams = CollectionParams & {
  name: string
}

type PaginationParams = {
  page: number
  size: number
}

type Closeable = { close: () => void }

export type PolicyCollection = CollectionResponse<Policy>
export type PolicySource = DataSourceResponse<Policy>
export type PolicyTypeCollectionSource = DataSourceResponse<{ policies: PolicyType[] }>
export type PolicyCollectionSource = DataSourceResponse<PolicyCollection>

export type PolicyDataplaneCollection = CollectionResponse<PolicyDataplane>
export type PolicyDataplaneSource = DataSourceResponse<PolicyDataplane>
export type PolicyDataplaneCollectionSource = DataSourceResponse<PolicyDataplaneCollection>

export const sources = (api: KumaApi) => {
  return {
    '/*/policy-types': (_params: {}, source: Closeable) => {
      source.close()

      return api.getPolicyTypes()
    },

    '/meshes/:mesh/policy-path/:path': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, path, size } = params
      const offset = params.size * (params.page - 1)

      return Policy.fromCollection(await api.getAllPolicyEntitiesFromMesh({ mesh, path }, { offset, size }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, path, name } = params

      return Policy.fromObject(await api.getSinglePolicyEntity({ mesh, path, name }))
    },

    '/meshes/:mesh/policy-path/:path/policy/:name/dataplanes': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, path, name } = params

      return PolicyDataplane.fromCollection(await api.getPolicyConnections({ mesh, path, name }))
    },
  }
}
