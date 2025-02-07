import createClient from 'openapi-fetch'

import { MeshGateway } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { Rule } from '@/app/rules/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { MeshGateway } from './data'

export type MeshGatewaySource = DataSourceResponse<MeshGateway>
export type MeshGatewayCollection = CollectionResponse<MeshGateway>
export type MeshGatewayCollectionSource = DataSourceResponse<MeshGatewayCollection>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
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
      const res = await http.GET('/meshes/{mesh}/{resourceType}/{resourceName}/_rules', {
        params: {
          path: {
            mesh: params.mesh,
            resourceType: 'meshgateways',
            resourceName: params.name,
          },
        },
      })
      return Rule.fromCollection(res.data!)
    },
  })
}
