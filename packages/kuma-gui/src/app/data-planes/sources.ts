import {
  Dataplane,
  DataplaneOverview,
  MeshGatewayDataplane,
  SidecarDataplane,
} from './data'
import type { Can } from '../application/services/can'
import type { DataSourceResponse } from '@/app/application'
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
const prop = <K extends PropertyKey>(obj: unknown, key: K | null | undefined): obj is Record<K, unknown> => {
  return key != null && obj != null && typeof obj === 'object' && key in obj
}
const filter = (data: Record<string, unknown>, cb: (key: string, arr: unknown[]) => unknown[]) => {
  const { configs } = data
  if (!Array.isArray(configs)) {
    return { configs: [] }
  }
  return {
    configs: configs.reduce((prev, item) => {
      const entries = Object.entries(item)

      const found = entries.reduce((prev, [key, value]) => {
        const found = cb(key, Array.isArray(value) ? value : [])
        if (found.length > 0) {
          if (typeof prev[key] === 'undefined') {
            prev[key] = []
          }
          prev[key] = prev[key].concat(found)
        }
        return prev
      }, {} as typeof configs[number])

      if (Object.keys(found).length > 0) {
        return prev.concat(found)
      }
      return prev

    }, [] as typeof configs),
  }
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
    // @deprecated please use either /xds, /clusters or /stats endpoints (ie. without /data-path)
    '/meshes/:mesh/dataplanes/:name/data-path/:dataPath': async (params) => {
      const { mesh, name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'

      return api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath,
      })
    },
    '/meshes/:mesh/dataplanes/:name/clusters': async (params) => {
      const { mesh, name } = params
      return api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath: 'clusters',
      })
    },
    '/meshes/:mesh/dataplanes/:dataplane/inbound/:inbound/xds': async (params) => {
      const { mesh, dataplane, inbound } = params

      // we don't ask for endpoints because we don't need them for inbound filtering
      const res = await api.getDataplaneXds({
        mesh,
        dppName: dataplane,
      }, {
        include_eds: false,
      })
      return filter(res, (key: string, arr: unknown[]) => {
        switch (key) {
          case 'dynamic_listeners':
            // dynamic_listeners[].name === 'inbound:<ignored>:0000'
            return arr.filter((item = {}) => prop(item, 'name') && typeof item.name === 'string' && item.name.startsWith('inbound:') && item.name?.endsWith(`:${inbound}`))
          case 'dynamic_active_clusters':
            // dynamic_active_clusters[].cluster.name === '<ignored>:0000'
            return arr.filter(item => prop(item, 'cluster') && prop(item.cluster, 'name') && typeof item.cluster.name === 'string' && item.cluster?.name?.endsWith(`:${inbound}`))
        }
        return []
      })
    },
    '/meshes/:mesh/dataplanes/:dataplane/outbound/:outbound/xds/:endpoints': async (params) => {
      const { mesh, dataplane, outbound, endpoints } = params

      // we don't ask for endpoints because we don't need them for inbound filtering
      const res = await api.getDataplaneXds({
        mesh,
        dppName: dataplane,
      }, {
        include_eds: endpoints,
      })
      return filter(res, (key: string, arr: unknown[]) => {
        switch (key) {
          case 'dynamic_listeners':
            // this one won't work yet see
            // https://github.com/kumahq/kuma/issues/12093
            // dynamic_listeners[].name === 'outbound:<outbound>'
            return arr.filter(item => prop(item, 'name') && item.name === `outbound:${outbound}`)
          case 'dynamic_active_clusters':
            // dynamic_active_clusters[].cluster.name === outbound
            return arr.filter(item => prop(item, 'cluster') && prop(item.cluster, 'name') && item.cluster?.name === outbound)
          case 'dynamic_endpoint_configs':
            // dynamic_endpoint_configs[].endpoint_config.cluster_name === outbound
            return arr.filter(item => prop(item, 'endpoint_config') && prop(item.endpoint_config, 'cluster_name') && item.endpoint_config?.cluster_name === outbound)
        }
        return []
      })
    },
    '/meshes/:mesh/dataplanes/:name/xds/:endpoints': async (params) => {
      const { mesh, name, endpoints } = params

      return api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath: 'xds',
      }, {
        include_eds: endpoints,
      })
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
