import {
  Dataplane,
  DataplaneOverview,
  Rule,
  RuleCollection,
  MeshGatewayDataplane,
  SidecarDataplane,
} from './data'
import type { Can } from '../application/services/can'
import type { DataSourceResponse } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import type KumaApi from '@/services/kuma-api/KumaApi'
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

export type DataplaneRulesSource = DataSourceResponse<RuleCollection>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
// any collection of non-spaces followed by a `:` or `: ` followed by a
// collection of non-spaces
// or
// a collection of non-spaces
//
// Should match:
// `kuma.io/service: name`
// `kuma.io/service:name`
// `version:1`
// `dpp-name`
const searchRe = /(\S+:\s*\S*)|(\S*)/g

export const search = (search: string) => {
  const map: Record<string, string> = {
    service: 'kuma.io/service',
    zone: 'kuma.io/zone',
    protocol: 'kuma.io/protocol',
  }
  const terms = [...search.matchAll(searchRe)].filter(item => item[0].length > 0).map(item => item[0].trim())
  return terms.reduce((prev, item) => {
    return (function parse(prev, item, tag = false) {
      const [key, ...value] = item.split(':')
      if (key === 'name') {
        prev.name = value.join(':').trim()
      } else if (!tag && value.length === 0) {
        prev.name = key.trim()
      } else if (key === 'tag') {
        return parse(prev, value.join(':').trim(), true)
      } else {
        prev.tag.push(`${map[key] || key}${value.length > 0 ? ':' : ''}${value.join(':').trim()}`)
      }
      return prev
    })(prev, item)
  }, { tag: [] } as { tag: string[], name?: string}) || {}
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

    '/meshes/:mesh/dataplanes/:name/data-path/:dataPath': async (params) => {
      const { mesh, name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'

      return api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath,
      })
    },

    '/meshes/:mesh/dataplanes/:name/sidecar-dataplane-policies': async (params) => {
      return SidecarDataplane.fromCollection(await api.getSidecarDataplanePolicies(params))
    },

    '/meshes/:mesh/dataplanes/:name/rules': async (params) => {
      return Rule.fromCollection(await api.getDataplaneRules(params))
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

      const filterParams = search(params.search)

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

    '/meshes/:mesh/dataplanes/for/:service': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const filterParams = search(params.search)

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
