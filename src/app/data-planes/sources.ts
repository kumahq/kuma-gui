import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import { normalizeFilterFields } from '@/app/common/filter-bar/normalizeFilterFields'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse, ApiKindListResponse as KindCollectionResponse } from '@/types/api.d'
import type { DataPlane, DataPlaneOverview as DataplaneOverview, DataplaneRule, SidecarDataplane } from '@/types/index.d'

type CollectionParams = {
  mesh: string
}

type DetailParams = CollectionParams & {
  name: string
}

type EnvoyDataParams = DetailParams & {
  dataPath: 'xds' | 'clusters' | 'stats'
}

type PaginationParams = {
  size: number
  page: number
  search: string
}

type ServiceParams = {
  service: string
}

type DataplaneTypeParams = {
  type: 'all' | 'delegated' | 'builtin'
}

type Closeable = { close: () => void }

export type DataplaneSource = DataSourceResponse<DataPlane>
export type DataplaneOverviewSource = DataSourceResponse<DataplaneOverview>
export type DataPlaneCollection = CollectionResponse<DataplaneOverview>
export type DataPlaneCollectionSource = DataSourceResponse<DataPlaneCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export type SidecarDataplaneCollection = KindCollectionResponse<SidecarDataplane>
export type SidecarDataplaneCollectionSource = DataSourceResponse<SidecarDataplaneCollection>

export type DataplaneRulesCollection = CollectionResponse<DataplaneRule>
export type DataplaneRulesCollectionSource = DataSourceResponse<DataplaneRulesCollection>

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
    return (function parse(prev, item) {
      const [key, ...value] = item.split(':')
      if (value.length === 0) {
        prev.name = key.trim()
      } else if (key === 'tag') {
        return parse(prev, value.join(':').trim())
      } else {
        prev.tag.push(`${map[key] || key}:${value.join(':').trim()}`)
      }
      return prev
    })(prev, item)
  }, { tag: [] } as { tag: string[], name?: string}) || {}
}

export const sources = (api: KumaApi) => {
  return {
    '/meshes/:mesh/dataplanes': async (params: CollectionParams & PaginationParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)
      const gateway = 'false'

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...search(params.search),
        gateway,
        offset,
        size,
      })
    },

    '/meshes/:mesh/dataplanes/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getDataplaneFromMesh({ mesh, name })
    },

    '/meshes/:mesh/dataplanes/:name/data-path/:dataPath': (params: EnvoyDataParams, source: Closeable) => {
      source.close()

      const { mesh, name, dataPath } = params

      return api.getDataplaneData({ mesh, dppName: name, dataPath })
    },

    '/meshes/:mesh/dataplanes/:name/sidecar-dataplanes-policies': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getSidecarDataplanePolicies({ mesh, name })
    },

    '/meshes/:mesh/dataplanes/:name/rules': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getDataplaneRules({ mesh, name })
    },

    '/meshes/:mesh/dataplane-overviews/:name': (params: DetailParams, source: Closeable) => {
      source.close()

      const { mesh, name } = params

      return api.getDataplaneOverviewFromMesh({ mesh, name })
    },

    '/meshes/:mesh/dataplanes/for/:service/of/:type': async (params: CollectionParams & ServiceParams & PaginationParams & DataplaneTypeParams, source: Closeable) => {
      source.close()

      const { mesh, size } = params
      const offset = params.size * (params.page - 1)

      // here 'all' means both proxies/sidecars and gateways this currently fits
      // our usecases but we should probably include `gateway | sidecar` or
      // similar
      const filterParams = search(params.search)

      filterParams.tag = filterParams.tag.filter((item) => !item.startsWith('kuma.io/service:'))
      filterParams.tag.push(`kuma.io/service:${params.service}`)
      const gatewayParams = params.type !== 'all' ? { gateway: params.type } : {}

      return api.getAllDataplaneOverviewsFromMesh({ mesh }, {
        ...filterParams,
        ...gatewayParams,
        offset,
        size,
      })
    },
  }
}
