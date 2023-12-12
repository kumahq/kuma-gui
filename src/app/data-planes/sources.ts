import { Dataplane, DataplaneOverview } from './data'
import type { Can } from '../application/services/can'
import { defineSources } from '@/app/application/services/data-source'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import { normalizeFilterFields } from '@/app/common/filter-bar/normalizeFilterFields'
import { parse, getTraffic } from '@/app/data-planes/data/stats'
import type { TrafficEntry } from '@/app/data-planes/data/stats'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { InspectRulesForDataplane, MeshGatewayDataplane, SidecarDataplane } from '@/types/index.d'

export type { Dataplane, DataplaneOverview } from './data'

export type DataplaneSource = DataSourceResponse<Dataplane>
export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataPlaneCollection = CollectionResponse<DataplaneOverview>
export type DataPlaneCollectionSource = DataSourceResponse<DataPlaneCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export type SidecarDataplaneCollection = KindCollectionResponse<SidecarDataplane>
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

export const sources = (api: KumaApi, can: Can) => {
  return defineSources({
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

      // outbounds are anything else unless it starts with something in the below list
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
      return api.getSidecarDataplanePolicies(params)
    },

    '/meshes/:mesh/dataplanes/:name/rules': async (params) => {
      return api.getDataplaneRules(params)
    },

    '/meshes/:mesh/dataplanes/:name/gateway-dataplane-policies': (params) => {
      return api.getMeshGatewayDataplane(params)
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
