import { ZoneOverview } from './data'
import type { DataSourceResponse, Source } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
export type { ZoneOverview } from './data'

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    ...zoneIngresses(source, api),
    ...zoneEgresses(api),

    '/zone-cps': async (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      return ZoneOverview.fromCollection(await api.getAllZoneOverviews({ size, offset }))
    },

    // doesn't resolve until we have at least one zone and one zone is online
    '/zone-cps/~online': (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      const OfflineError = class extends Error { }
      return source(async () => {
        const res = ZoneOverview.fromCollection(await api.getAllZoneOverviews({ size, offset }))
        if (res.total > 0 && res.items.some((item) => item.state === 'online')) {
          return res
        } else {
          throw new OfflineError()
        }
      }, {
        retry: (e) => {
          if (e instanceof OfflineError) {
            return new Promise((resolve) => setTimeout(resolve, 2000))
          }
        },
      })
    },
    '/zone-cps/online/:name': (params) => {
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
    '/zone-cps/:name': async (params) => {
      const { name } = params
      return ZoneOverview.fromObject(await api.getZoneOverview({ name }))
    },
  })
}
