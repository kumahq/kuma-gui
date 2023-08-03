import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { PolicyEntity as Policy, PolicyDataplane, PolicyType } from '@/types/index.d'

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

    '/:mesh/:path': (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const mesh = params.mesh
      const path = params.path
      const size = params.size
      const offset = params.size * (params.page - 1)

      return api.getAllPolicyEntitiesFromMesh({ mesh, path }, { offset, size })
    },

    '/:mesh/:path/:name/dataplanes': (params: DetailParams, source: Closeable) => {
      source.close()

      const mesh = params.mesh
      const path = params.path
      const name = params.name

      return api.getPolicyConnections({ mesh, path, name })
    },
  }
}
