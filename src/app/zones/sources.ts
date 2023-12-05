import { ZoneOverview } from './data'
import type { DataSourceResponse, Source } from '@/app/application'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
export type { ZoneOverview } from './data'
type PaginationParams = {
  size: number
  page: number
}

type DetailParams = {
  name: string
}

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (source: Source, api: KumaApi) => {
  return {
    ...zoneIngresses(api),
    ...zoneEgresses(api),

    '/zone-cps': async (params: PaginationParams) => {
      const { size } = params
      const offset = size * (params.page - 1)
      return ZoneOverview.fromCollection(await api.getAllZoneOverviews({ size, offset }))
    },

    '/zone-cps/:name': async (params: DetailParams) => {
      const { name } = params
      return ZoneOverview.fromObject(await api.getZoneOverview({ name }))
    },
    '/zone-cps/online/:name': (params: DetailParams) => {
      const ZoneOfflineError = class extends Error { }
      const { name } = params
      return source(async () => {
        const res = ZoneOverview.fromObject(await api.getZoneOverview({ name }))
        // anything but online, retry
        if (res.state === 'online') {
          return res
        } else {
          throw new ZoneOfflineError()
        }
      }, {
        retry: (e) => {
          if (e instanceof ZoneOfflineError) {
            return new Promise((resolve) => setTimeout(resolve, 2000))
          }
        },
      })
    },

  }
}
