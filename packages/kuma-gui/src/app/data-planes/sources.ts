import { TarWriter } from '@gera2ld/tarjs'
import createClient from 'openapi-fetch'

import {
  Dataplane,
  DataplaneOverview,
  MeshGatewayDataplane,
  SidecarDataplane,
  DataplaneNetworkingLayout,
} from './data'
import { YAML , defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { Resource } from '@/app/resources/data/Resource'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type {
  SidecarDataplane as PartialSidecarDataplane,
  MeshGatewayDataplane as PartialMeshGatewayDataplane,
  DataPlaneOverview as PartialDataplaneOverview,
} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'

export type { Dataplane, DataplaneOverview } from './data'

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/meshes/:mesh/dataplanes/:name': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return Dataplane.fromObject(res.data!)
    },

    '/meshes/:mesh/dataplanes/:name/as/kubernetes': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}', {
        params: {
          path: {
            mesh,
            name,
          },
          // @ts-ignore
          query: {
            format: 'kubernetes',
          },
        },
      })
      return res.data
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
              const res = await http.GET('/meshes/{mesh}/dataplanes/{name}', {
                params: {
                  path: {
                    mesh,
                    name,
                  },
                },
              })
              return {
                name: 'dataplane.yaml',
                content: YAML.stringify(res.data),
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
              const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/xds', {
                params: {
                  path: {
                    mesh,
                    name,
                  },
                  query: {
                    include_eds: spec.eds,
                  },
                },
              })
              return {
                name: 'xds.json',
                content: JSON.stringify(res.data, null, 2),
              }
            })
            break
          case 'stats':
            prev.push(async () => {
              const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/stats', {
                parseAs: 'text',
                params: {
                  path: {
                    mesh,
                    name,
                  },
                },
              })
              return {
                name: 'stats.txt',
                content: res.data ?? '',
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/clusters', {
                parseAs: 'text',
                params: {
                  path: {
                    mesh,
                    name,
                  },
                },
              })
              return {
                name: 'clusters.txt',
                content: res.data ?? '',
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

    // @TODO why are these two the same but not?
    '/meshes/:mesh/dataplanes/:name/sidecar-dataplane-policies': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/policies', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return SidecarDataplane.fromCollection(res.data! as unknown as KindCollectionResponse<PartialSidecarDataplane>)
    },

    '/meshes/:mesh/dataplanes/:name/gateway-dataplane-policies': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/policies', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return MeshGatewayDataplane.fromObject(res.data! as unknown as PartialMeshGatewayDataplane)
    },
    // end TODO

    '/meshes/:mesh/dataplane-overviews/:name': async (params) => {
      const { mesh, name } = params
      const res = await http.GET('/meshes/{mesh}/dataplanes/{name}/_overview', {
        params: {
          path: {
            mesh,
            name,
          },
        },
      })
      return DataplaneOverview.fromObject(res.data! as unknown as PartialDataplaneOverview)
    },

    '/meshes/:mesh/dataplanes/of/:type': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const search = Resource.search(params.search)

      const type = params.type === 'standard' ? 'false' : params.type
      const gatewayParams = includes(['delegated', 'builtin', 'false'] as const, type)
        ? { gateway: type }
        : {}
      const zoneIngress = type === 'zone-ingress' ? Resource.search('kuma.io/listener-zoneingress:enabled') : {}
      const zoneEgress = type === 'zone-egress' ? Resource.search('kuma.io/listener-zoneegress:enabled') : {}

      const res = await http.GET('/meshes/{mesh}/dataplanes/_overview', {
        params: {
          path: {
            mesh,
          },
          // @ts-ignore OpenAPI is wrong
          query: {
            ...search,
            ...zoneIngress,
            ...zoneEgress,
            ...gatewayParams,
            offset,
            size,
          },
        },
      })
      return DataplaneOverview.fromCollection(res.data! as unknown as CollectionResponse<PartialDataplaneOverview>)
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

      const res = await http.GET('/meshes/{mesh}/dataplanes/_overview', {
        params: {
          path: {
            mesh,
          },
          // @ts-ignore OpenAPI is wrong
          query: {
            ...search,
            // @TODO check these tags
            tag,
            offset,
            size,
          },
        },
      })
      return DataplaneOverview.fromCollection(res.data! as unknown as CollectionResponse<PartialDataplaneOverview>)
    },

    '/meshes/:mesh/dataplanes/for/service-insight/:service': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const search = Resource.search(params.search)

      // Service dataplanes should always be filtered by the service tag
      const tag = [...(Array.isArray(search.tag) ? search.tag.filter((item) => !item.startsWith('kuma.io/service')) : []), `kuma.io/service:${params.service}`]

      const res = await http.GET('/meshes/{mesh}/dataplanes/_overview', {
        params: {
          path: {
            mesh,
          },
          // @ts-ignore OpenAPI is wrong
          query: {
            ...search,
            // @TODO check these tags
            tag,
            offset,
            size,
          },
        },
      })
      return DataplaneOverview.fromCollection(res.data! as unknown as CollectionResponse<PartialDataplaneOverview>)
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
