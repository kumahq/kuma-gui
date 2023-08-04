import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { MeshInsight, ZoneOverview } from '@/types/index.d'
import { fetchAllResources } from '@/utilities/helpers'

type Closeable = {close: () => void}

export type MeshInsightSource = DataSourceResponse<MeshInsight>
export type MeshInsightCollection = CollectionResponse<MeshInsight>
export type MeshInsightCollectionSource = DataSourceResponse<MeshInsightCollection>

export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export const sources = (api: KumaApi) => {
  return {
    '/all-mesh-insights': (_params: {}, source: Closeable) => {
      source.close()

      return fetchAllResources(api.getAllMeshInsights.bind(api))
    },

    '/all-zone-overviews': (_params: {}, source: Closeable) => {
      source.close()

      return fetchAllResources(api.getAllZoneOverviews.bind(api))
    },
  }
}
