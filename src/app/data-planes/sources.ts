import { defineSources } from '@/app/application/services/data-source'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import { normalizeFilterFields } from '@/app/common/filter-bar/normalizeFilterFields'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { DataPlane, DataPlaneOverview as DataplaneOverview, DataplaneRule, MeshGatewayDataplane, SidecarDataplane } from '@/types/index.d'

export type DataplaneSource = DataSourceResponse<DataPlane>
export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataPlaneCollection = CollectionResponse<DataplaneOverview>
export type DataPlaneCollectionSource = DataSourceResponse<DataPlaneCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export type SidecarDataplaneCollection = KindCollectionResponse<SidecarDataplane>
export type SidecarDataplaneCollectionSource = DataSourceResponse<SidecarDataplaneCollection>

export type MeshGatewayDataplaneSource = DataSourceResponse<MeshGatewayDataplane>

export type DataplaneRulesCollection = CollectionResponse<DataplaneRule>
export type DataplaneRulesCollectionSource = DataSourceResponse<DataplaneRulesCollection>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/dataplanes/:name': async (params) => {
      return api.getDataplaneFromMesh(params)
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
      return api.getDataplaneOverviewFromMesh(params)
    },

    '/meshes/:mesh/dataplanes/of/:type': async (params) => {
      const { mesh, size } = params
      const offset = size * (params.page - 1)

      const filterParams = Object.fromEntries(normalizeFilterFields(JSON.parse(params.search || '[]')))

      const type = params.type === 'standard' ? 'false' : params.type
      const gatewayParams = includes(['delegated', 'builtin', 'false'] as const, type)
        ? { gateway: type }
        : {}

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        ...gatewayParams,
        offset,
        size,
      })
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

      // we use `all` in code to mean "don't specify ?gateway=0 at all" i.e.
      // both gateway and sidecars
      const type = params.type === 'standard' ? 'false' : params.type
      const gatewayParams = includes(['delegated', 'builtin', 'false'] as const, type)
        ? { gateway: type }
        : {}

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        ...gatewayParams,
        offset,
        size,
      })
    },
  })
}
