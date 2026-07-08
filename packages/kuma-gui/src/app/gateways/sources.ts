import createClient from 'openapi-fetch'

import { MeshGateway } from './data'
import { useFetch } from '../kuma'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { KumaResourceTypeDescriptorCollection } from '@/app/resources/data'
import { Rule } from '@/app/rules/data'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { MeshGateway } from './data'

export type MeshGatewaySource = DataSourceResponse<MeshGateway>
export type MeshGatewayCollection = CollectionResponse<MeshGateway>
export type MeshGatewayCollectionSource = DataSourceResponse<MeshGatewayCollection>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/mesh-gateways': async (params) => {
      const { mesh, size } = params
      const offset = params.size * (params.page - 1)
      const search = MeshGateway.search(params.search)

      const res = await http.GET('/meshes/{mesh}/meshgateways', {
        params: {
          path: {
            mesh,
          },
          query: {
            offset,
            size,
            ...search,
          },
        },
      })
      return MeshGateway.fromCollection(res.data!)
    },

    '/meshes/:mesh/mesh-gateways/:name': async (params) => {
      const { mesh, name } = params

      const res = await http.GET('/meshes/{mesh}/meshgateways/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return MeshGateway.fromObject(res.data!)
    },

    '/meshes/:mesh/mesh-gateways/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/meshgateways/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-expect-error OpenAPI says this is undefined
          query: {
            format: 'kubernetes',
          },
        },
      })
      // TODO
      return res.data
    },

    '/meshes/:mesh/mesh-gateways/:name/rules': async (params) => {
      const fetch = useFetch()
      const resources = await fetch<KumaResourceTypeDescriptorCollection>('/resource-type-descriptors')
      const res = await http.GET('/meshes/{mesh}/{resourceType}/{resourceName}/_rules', {
        params: {
          path: {
            mesh: params.mesh,
            resourceType: 'meshgateways',
            resourceName: params.name,
          },
        },
      })
      return Rule.fromCollection(res.data!, resources)
    },
  })
}
