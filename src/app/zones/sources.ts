import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneOverview, ZoneIngressOverview, ZoneEgressOverview } from '@/types/index.d'

type PaginationParams = {
  size: number
  page: number
}

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type ZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type ZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type ZoneEgressOverviewCollectionSource = DataSourceResponse<ZoneEgressOverviewCollection>

export const sources = (api: KumaApi) => {
  return {
    '/zone-cps': async (params: PaginationParams, source: { close: () => void }) => {
      const size = params.size
      const offset = params.size * (params.page - 1)

      const res = await api.getAllZoneOverviews({ size, offset })
      source.close()
      return res
    },

    '/zone-ingresses': async (params: PaginationParams, source: { close: () => void }) => {
      const size = params.size
      const offset = params.size * (params.page - 1)

      const res = await api.getAllZoneIngressOverviews({ size, offset })
      source.close()
      return res
    },

    '/zone-egresses': async (params: PaginationParams, source: { close: () => void }) => {
      const size = params.size
      const offset = params.size * (params.page - 1)

      const res = await api.getAllZoneEgressOverviews({ size, offset })
      source.close()
      return res
    },
  }
}
