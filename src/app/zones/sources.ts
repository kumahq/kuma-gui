import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneOverview } from '@/types/index.d'
export type { ZoneOverview } from '@/types/index.d'
type PaginationParams = {
  size: number
  page: number
}

type DetailParams = {
  name: string
}

type Closeable = { close: () => void }

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return {
    ...zoneIngresses(api),
    ...zoneEgresses(api),

    '/zone-cps': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const { size } = params
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneOverviews({ size, offset })
    },

    '/zone-cps/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneOverview({ name })
    },

  }
}
