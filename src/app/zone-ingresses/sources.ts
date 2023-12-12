import { ZoneIngressOverview, ZoneIngress } from './data'
import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

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

export type ZoneIngressSource = DataSourceResponse<ZoneIngress>
export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return {

    '/zone-cps/:name/ingresses': async (params: DetailParams & PaginationParams): Promise<ZoneIngressOverviewCollection> => {
      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneIngressOverviews({ size, offset })
      // temporary frontend filtering until we have support for filtering
      // 'gresses by zone in the backend. Until we have backend support its fine
      // to assume we won't need to recreate paging for 'gresses
      res.items = res.items.filter((item) => {
        return item.zoneIngress.zone === name
      })
      return ZoneIngressOverview.fromCollection(res)
    },

    '/zone-ingresses/:name': async (params: DetailParams) => {
      const { name } = params

      return ZoneIngress.fromObject(await api.getZoneIngress({ name }))
    },

    '/zone-ingresses/:name/data-path/:dataPath': (params: EnvoyDataParams) => {
      const { name, dataPath } = params
      return api.getZoneIngressData({ zoneIngressName: name, dataPath })
    },

    '/zone-ingress-overviews': async (params: PaginationParams) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return ZoneIngressOverview.fromCollection(await api.getAllZoneIngressOverviews({ size, offset }))
    },

    '/zone-ingress-overviews/:name': async (params: DetailParams) => {
      const { name } = params

      return ZoneIngressOverview.fromObject(await api.getZoneIngressOverview({ name }))
    },
  }
}
