import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneIngressOverview, ZoneIngress } from '@/types/index.d'

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

export type ZoneIngressSource = DataSourceResponse<ZoneIngress>
export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return {

    '/zone-cps/:name/ingresses': async (params: DetailParams & PaginationParams, source: Closeable) => {
      source.close()

      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneIngressOverviews({ size, offset })
      res.items = res.items.filter((item) => {
        return item.zoneIngress.zone === name
      })
      res.total = res.items.length
      return res
    },

    '/zone-ingresses/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneIngress({ name })
    },

    '/zone-ingresses/:name/data-path/:dataPath': (params: EnvoyDataParams, source: Closeable) => {
      source.close()

      const { name, dataPath } = params

      return api.getZoneIngressData({ zoneIngressName: name, dataPath })
    },

    '/zone-ingress-overviews': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const { size } = params
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneIngressOverviews({ size, offset })
    },

    '/zone-ingress-overviews/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneIngressOverview({ name })
    },
  }
}
