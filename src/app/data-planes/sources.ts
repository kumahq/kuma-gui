import {
  Dataplane,
  DataplaneOverview,
  InspectRules,
  InspectRulesForDataplane,
  MeshGatewayDataplane,
  SidecarDataplane,
} from './data'
import type { Can } from '../application/services/can'
import type { DataSourceResponse } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import { normalizeFilterFields } from '@/app/common/filter-bar/normalizeFilterFields'
import { parse, getTraffic } from '@/app/data-planes/data/stats'
import type { TrafficEntry } from '@/app/data-planes/data/stats'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { PolicyTypeEntry } from '@/types/index.d'

export type { Dataplane, DataplaneOverview } from './data'

export type DataplaneSource = DataSourceResponse<Dataplane>

export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataplaneOverviewCollection = CollectionResponse<DataplaneOverview>
export type DataplaneOverviewCollectionSource = DataSourceResponse<DataplaneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export type SidecarDataplaneCollection = KindCollectionResponse<SidecarDataplane> & { policyTypeEntries: PolicyTypeEntry[] }
export type SidecarDataplaneCollectionSource = DataSourceResponse<SidecarDataplaneCollection>

export type MeshGatewayDataplaneSource = DataSourceResponse<MeshGatewayDataplane>

export type DataplaneRulesSource = DataSourceResponse<InspectRulesForDataplane>

export type TrafficSource = DataSourceResponse<{
  inbounds: TrafficEntry[]
  outbounds: TrafficEntry[]
  passthrough: TrafficEntry[]
}>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export const sources = (source: Source, api: KumaApi, can: Can) => {
  return defineSources({
    '/dataplanes/poll': (params) => {
      const { size, page } = params
      const offset = size * (page - 1)
      const canUseZones = can('use zones')

      return source(async () => {
        return DataplaneOverview.fromCollection(await api.getAllDataplaneOverviews({ size, offset }), canUseZones)
      }, { interval: 1000 })
    },

    '/meshes/:mesh/dataplanes/:name': async (params) => {
      return Dataplane.fromObject(await api.getDataplaneFromMesh(params))
    },

    '/meshes/:mesh/dataplanes/:name/traffic': async (params) => {
      const { mesh, name } = params
      const res = await api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath: 'stats',
      })

      // parse the stuff
      const json = parse(res)

      // inbounds is anything starting with `localhost_`
      const inbounds = getTraffic(json, (key) => key.startsWith('localhost_'))

      // outbounds are anything else unless it starts with something in the
      // below list these are likely to follow a pattern at some point at which
      // point this list can be removed and replaced by something that exludes
      // the pattern
      const outbounds = getTraffic(json, (key) => {
        return ![
          'admin',
          'async-client',
          'kuma_envoy_admin',
          'probe_listener',
          'localhost_',
          'inbound_passthrough',
          'outbound_passthrough',
          'access_log_sink',
          'ads_cluster',
          'meshtrace_zipkin',
        ].some(item => key.startsWith(item))
      })

      // passthrough traffic is anything that starts with this list
      const passthrough = getTraffic(json, (key) => [
        'outbound_passthrough_',
      ].some(item => key.startsWith(item)))

      return {
        passthrough,
        inbounds,
        outbounds,
        $raw: res,
        config: res,
      }
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
      return InspectRules.fromCollection(await api.getDataplaneRules(params))
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

      const filterParams = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))

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

    '/meshes/:mesh/dataplanes/for/:service/of/:type': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const filterParams = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))

      if (typeof filterParams.tag === 'undefined') {
        filterParams.tag = []
      }
      filterParams.tag = filterParams.tag.filter((item) => !item.startsWith('kuma.io/service:'))
      filterParams.tag.push(`kuma.io/service:${params.service}`)

      // we use `all` in code to mean "don't specify `?gateway` in the API URL" i.e.
      // both gateway and sidecars
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
  })
}
