import { TarWriter } from '@gera2ld/tarjs'

import {
  Dataplane,
  DataplaneOverview,
  MeshGatewayDataplane,
  SidecarDataplane,
} from './data'
import type { Can } from '../application/services/can'
import type { DataSourceResponse } from '@/app/application'
import { YAML } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { PolicyTypeEntry } from '@/types/index.d'

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
export const sources = (source: Source, api: KumaApi, can: Can) => {
  return defineSources({
    // always resolves and keeps polling until we have at least one dataplane and all dataplanes are online
    '/dataplanes/poll': (params) => {
      const { size, page } = params
      const offset = size * (page - 1)
      const canUseZones = can('use zones')

      return source(async (source) => {
        const res = DataplaneOverview.fromCollection(await api.getAllDataplaneOverviews({ size, offset }), canUseZones)
        if (res.total > 0 && res.items.every(item => item.status === 'online')) {
          source.close()
        }
        return res
      }, { interval: 1000 })
    },
    // doesn't resolve until we have at least one dataplane and all dataplanes are online
    '/dataplanes/online': (params) => {
      const OfflineError = class extends Error { }
      const { size, page } = params
      const offset = size * (page - 1)
      const canUseZones = can('use zones')
      return source(async () => {
        const res = DataplaneOverview.fromCollection(await api.getAllDataplaneOverviews({ size, offset }), canUseZones)
        if (res.total > 0 && res.items.every((item) => item.status === 'online')) {
          return res
        } else {
          throw new OfflineError()
        }
      }, {
        retry: (e) => {
          if (e instanceof OfflineError) {
            return new Promise((resolve) => setTimeout(resolve, 1000))
          }
        },
      })
    },

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
          case 'dataplane':
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
          case 'xds':
            prev.push(async () => {
              return {
                name: 'xds.json',
                content: JSON.stringify(await api.getDataplaneXds({
                  mesh,
                  dppName: name,
                }, {
                  include_eds: spec.eds,
                })),
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
      return DataplaneOverview.fromObject(await api.getDataplaneOverviewFromMesh(params), can('use zones'))
    },

    '/meshes/:mesh/dataplanes/of/:type': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const filterParams = DataplaneOverview.search(params.search)

      const type = params.type === 'standard' ? 'false' : params.type
      const gatewayParams = includes(['delegated', 'builtin', 'false'] as const, type)
        ? { gateway: type }
        : {}

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        ...gatewayParams,
        offset,
        size,
      }), can('use zones'))
    },

    '/meshes/:mesh/dataplanes/for/mesh-service/:tags': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)
      const filterParams = DataplaneOverview.search(params.search)

      if (typeof filterParams.tag === 'undefined') {
        filterParams.tag = []
      }
      // MeshService dataplanes should always be filtered by the zone for the MeshService via dataplaneTags
      filterParams.tag = filterParams.tag.filter((item) => !item.startsWith('kuma.io/zone:'))
      filterParams.tag = filterParams.tag.concat(Object.entries(JSON.parse(params.tags)).map(([key, value]) => `${key}:${value}`))

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        offset,
        size,
      }), can('use zones'))
    },

    '/meshes/:mesh/dataplanes/for/service-insight/:service': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const filterParams = DataplaneOverview.search(params.search)

      if (typeof filterParams.tag === 'undefined') {
        filterParams.tag = []
      }
      filterParams.tag = filterParams.tag.filter((item) => !item.startsWith('kuma.io/service:'))
      filterParams.tag.push(`kuma.io/service:${params.service}`)

      return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        offset,
        size,
      }), can('use zones'))
    },
  })
}
