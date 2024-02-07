import { ZoneEgressOverview, ZoneEgress } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type ZoneEgressSource = DataSourceResponse<ZoneEgress>
export type ZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type ZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type ZoneEgressOverviewCollectionSource = DataSourceResponse<ZoneEgressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
export const sources = (api: KumaApi) => {
  return defineSources({
    '/zone-cps/:name/egresses': async (params) => {
      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneEgressOverviews({ size, offset })
      if (name !== '*') {
        // temporary frontend filtering until we have support for filtering
        // 'gresses by zone in the backend. Until we have backend support its fine
        // to assume we won't need to recreate paging for 'gresses
        res.items = res.items.filter((item) => {
          return item.zoneEgress.zone === name
        })
        res.total = res.items.length
      }
      return ZoneEgressOverview.fromCollection(res)
    },

    '/zone-egresses/:name': async (params) => {
      const { name } = params

      return ZoneEgress.fromObject(await api.getZoneEgress({ name }))
    },

    '/zone-egresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      return await api.getZoneEgress({ name }, { format: 'kubernetes' })
    },

    '/zone-egresses/:name/data-path/:dataPath': (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'

      return api.getZoneEgressData({ zoneEgressName: name, dataPath })
    },

    '/zone-egress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return ZoneEgressOverview.fromCollection(await api.getAllZoneEgressOverviews({ size, offset }))
    },

    '/zone-egress-overviews/:name': async (params) => {
      const { name } = params

      return ZoneEgressOverview.fromObject(await api.getZoneEgressOverview({ name }))
    },
  })
}
