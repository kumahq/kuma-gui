import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneEgressOverview, ZoneEgress } from '@/types/index.d'
type PaginationParams = {
  size: number
  page: number
}

type DetailParams = {
  name: string
}

type EnvoyDataParams = DetailParams & {
  dataPath: 'xds' | 'clusters' | 'stats'
}

type Closeable = { close: () => void }

export type ZoneEgressSource = DataSourceResponse<ZoneEgress>
export type ZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type ZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type ZoneEgressOverviewCollectionSource = DataSourceResponse<ZoneEgressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return {
    '/zone-cps/:name/egresses': async (params: DetailParams & PaginationParams, source: Closeable) => {
      source.close()

      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneEgressOverviews({ size, offset })
      if (name !== '*') {
        res.items = res.items.filter((item) => {
          return item.zoneEgress.zone === name
        })
        res.total = res.items.length
      }
      return res
    },

    '/zone-egresses/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneEgress({ name })
    },

    '/zone-egresses/:name/data-path/:dataPath': (params: EnvoyDataParams, source: Closeable) => {
      source.close()

      const { name, dataPath } = params

      return api.getZoneEgressData({ zoneEgressName: name, dataPath })
    },

    '/zone-egress-overviews': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const { size } = params
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneEgressOverviews({ size, offset })
    },

    '/zone-egress-overviews/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneEgressOverview({ name })
    },
  }
}
