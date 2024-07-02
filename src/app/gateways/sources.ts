import { MeshGateway } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { Rule, type RuleCollection } from '@/app/rules/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type { MeshGateway } from './data'

export type MeshGatewaySource = DataSourceResponse<MeshGateway>
export type MeshGatewayCollection = CollectionResponse<MeshGateway>
export type MeshGatewayCollectionSource = DataSourceResponse<MeshGatewayCollection>

export type GatewayRulesSource = DataSourceResponse<RuleCollection>

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

    '/meshes/:mesh/mesh-gateways/:name/rules': async (params) => {
      return Rule.fromCollection(await api.getMeshGatewayRules(params))
    },
  })
}
