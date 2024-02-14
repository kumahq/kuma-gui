import { MeshGateway } from './data'
import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'
import { PolicyDataplane } from '@/app/policies/data'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type { MeshGateway } from './data'

export type MeshGatewaySource = DataSourceResponse<MeshGateway>
export type MeshGatewayCollection = CollectionResponse<MeshGateway>
export type MeshGatewayCollectionSource = DataSourceResponse<MeshGatewayCollection>

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/mesh-gateways': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      return MeshGateway.fromCollection(await api.getAllMeshGatewaysFromMesh({ mesh }, { size, offset }))
    },

    '/meshes/:mesh/mesh-gateways/:name': async (params) => {
      const { mesh, name } = params

      return MeshGateway.fromObject(await api.getMeshGateway({ mesh, name }))
    },

    '/meshes/:mesh/mesh-gateways/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params

      return api.getMeshGateway({ mesh, name }, { format: 'kubernetes' })
    },

    '/meshes/:mesh/mesh-gateways/:name/dataplanes': async (params) => {
      const { mesh, name } = params
      const path = 'meshgateways'

      return PolicyDataplane.fromCollection(await api.getPolicyConnections({ mesh, path, name }))
    },
  })
}
