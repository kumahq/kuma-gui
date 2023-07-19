import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneOverview, ZoneIngressOverview, ZoneEgressOverview } from '@/types/index.d'
import { fetchAllResources } from '@/utilities/helpers'

type PaginationParams = {
  size: number
  page: number
}

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type AllZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type AllZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type AllZoneIngressOverviewCollectionSource = DataSourceResponse<AllZoneIngressOverviewCollection>

export type AllZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type AllZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type AllZoneEgressOverviewCollectionSource = DataSourceResponse<AllZoneEgressOverviewCollection>

export const sources = (api: KumaApi) => {
  return {
    '/zones/zone-cps': async (params: PaginationParams, source: { close: () => void }) => {
      source.close()

      const size = params.size
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneOverviews({ size, offset })
    },

    '/zones/all-zone-ingresses': async (_params: unknown, source: { close: () => void }) => {
      source.close()

      return await fetchAllResources(api.getAllZoneIngressOverviews.bind(api))
    },

    '/zones/all-zone-egresses': async (_params: unknown, source: { close: () => void }) => {
      source.close()

      return await fetchAllResources(api.getAllZoneEgressOverviews.bind(api))
    },
  }
}
