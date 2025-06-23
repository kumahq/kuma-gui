import { ZoneOverview } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
export type { ZoneOverview } from './data'

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return defineSources({
    ...zoneIngresses(api),
    ...zoneEgresses(api),

    '/zone-cps': async (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      const search = ZoneOverview.search(params.search)

      return ZoneOverview.fromCollection(await api.getAllZoneOverviews({ size, offset, ...search }))
    },
    '/zone-cps/:name': async (params) => {
      const { name } = params
      return ZoneOverview.fromObject(await api.getZoneOverview({ name }))
    },
  })
}
