import { getZoneControlPlaneStatus } from './data'
import type { DataSourceResponse, Source } from '@/app/application'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import { ApiError } from '@/services/kuma-api/ApiError'
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
      return api.getAllZoneOverviews({ size, offset })
    },

    '/zone-cps/:name': async (params: DetailParams) => {
      const { name } = params
      return api.getZoneOverview({ name })
    },
    '/zone-cps/online/:name': (params: DetailParams) => {
      // this source retries until we have a 200 and the zone found is online
      // any non-404 errors will error as usual
      const { name } = params
      return source(async () => {
        const res = await api.getZoneOverview({ name })
        if (getZoneControlPlaneStatus(res) === 'online') {
          return res
        } else {
          const e = new ApiError({
            status: 404,
            title: `The ${res.name} Zone is offline`,
          })
          throw e
        }
      }, {
        retry: (e) => {
          const hasStatus = <T extends {status: number}>(e: unknown): e is T => typeof (e as T).status !== 'undefined'
          if (hasStatus(e)) {
            const status = e.status.toString()
            switch (true) {
              case status === '404':
                // wait 2 seconds and try again
                return new Promise((resolve) => setTimeout(resolve, 2000))
            }
          }
        },
      })
    },

  }
}
