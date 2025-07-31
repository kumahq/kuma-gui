import { TarWriter } from '@gera2ld/tarjs'
import createClient from 'openapi-fetch'

import {
  Dataplane,
  DataplaneOverview,
  MeshGatewayDataplane,
  SidecarDataplane,
  DataplaneNetworkingLayout,
} from './data'
import type { DataSourceResponse } from '@/app/application'
import { YAML } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { Resource } from '@/app/resources/data/Resource'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { PolicyTypeEntry } from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { Dataplane, DataplaneOverview } from './data'

export type DataplaneSource = DataSourceResponse<Dataplane>

export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataplaneOverviewCollection = CollectionResponse<DataplaneOverview>
export type DataplaneOverviewCollectionSource = DataSourceResponse<DataplaneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>
export type ClustersDataSource = DataSourceResponse<string>

export type SidecarDataplaneCollection = KindCollectionResponse<SidecarDataplane> & { policyTypeEntries: PolicyTypeEntry[] }
export type SidecarDataplaneCollectionSource = DataSourceResponse<SidecarDataplaneCollection>

export type MeshGatewayDataplaneSource = DataSourceResponse<MeshGatewayDataplane>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/dataplanes/:name': async (params) => {
      return Dataplane.fromObject(await api.getDataplaneFromMesh(params))
    },

    '/meshes/:mesh/dataplanes/:name/as/kubernetes': async (params) => {
      return api.getDataplaneFromMesh(params, { format: 'kubernetes' })
    },
    '/meshes/:mesh/dataplanes/:name/as/tarball/:spec': async (params) => {
      const { mesh, name } = params
      const spec = JSON.parse(params.spec)
      const requests = Object.entries(spec).filter(([_, value]) => {
        return value
      }).reduce((prev, [key]) => {
        switch (key) {
          case 'proxy':
            prev.push(async () => {
              return {
                name: 'dataplane.yaml',
                content: YAML.stringify(await api.getDataplaneFromMesh({
                  mesh,
                  name,
                })),
              }
            })
            break
          case 'policies':
            prev.push(async () => {
              const res = await http.GET('/meshes/{mesh}/{resourceType}/{resourceName}/_rules', {
                params: {
                  path: {
                    mesh,
                    resourceType: 'dataplanes',
                    resourceName: name,
                  },
                },
              })
              return {
                name: 'policies.json',
                content: JSON.stringify(res!, null, 2),
              }
            })
            break
          case 'xds':
            prev.push(async () => {
              return {
                name: 'xds.json',
                content: JSON.stringify(await api.getDataplaneXds({
                  mesh,
                  dppName: name,
                }, {
                  include_eds: spec.eds,
                }), null, 2),
              }
            })
            break
          case 'stats':
            prev.push(async () => {
              return {
                name: 'stats.txt',
                content: await api.getDataplaneStats({
                  mesh,
                  dppName: name,
                }),
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              return {
                name: 'clusters.txt',
                content: await api.getDataplaneClusters({
                  mesh,
                  dppName: name,
                }),
              }
            })
            break
        }
        return prev
      }, [] as (() => Promise<{ name: string, content: string }>)[])

      const files = await Promise.all(requests.map(item => item()))
      const tarball = new TarWriter()
      const id = `${mesh}_${name}`
      files.forEach(({ name, content }) => {
        tarball.addFile(`${id}/${name}`, content)
      })
      return {
        name: `${id}.tar`,
        url: URL.createObjectURL(new Blob([await tarball.write()], { type: 'application/tar' })),
      }
    },

    '/meshes/:mesh/dataplanes/:name/sidecar-dataplane-policies': async (params) => {
      return SidecarDataplane.fromCollection(await api.getSidecarDataplanePolicies(params))
    },

    '/meshes/:mesh/dataplanes/:name/gateway-dataplane-policies': async (params) => {
      return MeshGatewayDataplane.fromObject(await api.getMeshGatewayDataplane(params))
    },

    '/meshes/:mesh/dataplane-overviews/:name': async (params) => {
      return DataplaneOverview.fromObject(await api.getDataplaneOverviewFromMesh(params))
    },

    '/meshes/:mesh/dataplanes/of/:type': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const search = Resource.search(params.search)

      const type = params.type === 'standard' ? 'false' : params.type
      const gatewayParams = includes(['delegated', 'builtin', 'false'] as const, type)
        ? { gateway: type }
        : {}

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...search,
        ...gatewayParams,
        offset,
        size,
      }))
    },

    '/meshes/:mesh/dataplanes/for/mesh-service/:tags': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)
      const search = Resource.search(params.search)

      // MeshService dataplanes should always be filtered by the zone for the MeshService via `dataplaneTags`
      // The zone tag is part of the search query `zone:<zone>`, but there might be more tags in `dataplaneTags`
      const tagsParam = JSON.parse(params.tags ?? '{}')
      const searchTags = Array.isArray(search.tag) ? search.tag : []
      const tag = [...searchTags, ...Object.entries(tagsParam).map(([key, value]) => `${key}:${value}`)]

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...search,
        tag,
        offset,
        size,
      }))
    },

    '/meshes/:mesh/dataplanes/for/service-insight/:service': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const search = Resource.search(params.search)

      // Service dataplanes should always be filtered by the service tag
      const tag = [...(Array.isArray(search.tag) ? search.tag.filter((item) => !item.startsWith('kuma.io/service')) : []), `kuma.io/service:${params.service}`]

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...search,
        tag,
        offset,
        size,
      }))
    },

    '/meshes/:mesh/dataplanes/:name/layout': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/_layout', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return DataplaneNetworkingLayout.fromObject(res.data!)
    },
  })
}
