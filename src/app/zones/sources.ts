import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { ZoneOverview, ZoneIngressOverview, ZoneEgressOverview, ZoneIngress, ZoneEgress } from '@/types/index.d'

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

type Closeable = { close: () => void }

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type ZoneIngressSource = DataSourceResponse<ZoneIngress>
export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type ZoneEgressSource = DataSourceResponse<ZoneEgress>
export type ZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type ZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type ZoneEgressOverviewCollectionSource = DataSourceResponse<ZoneEgressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  return {
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

    '/zone-ingresses': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const { size } = params
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneIngressOverviews({ size, offset })
    },

    '/zone-ingresses/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneIngress({ name })
    },

    '/zone-ingresses/:name/data-path/:dataPath': (params: EnvoyDataParams, source: Closeable) => {
      source.close()

      const { name, dataPath } = params

      return api.getZoneIngressData({ zoneIngressName: name, dataPath })
    },

    '/zone-ingress-overviews/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneIngressOverview({ name })
    },

    '/zone-egresses': async (params: PaginationParams, source: Closeable) => {
      source.close()

      const { size } = params
      const offset = params.size * (params.page - 1)

      return await api.getAllZoneEgressOverviews({ size, offset })
    },

    '/zone-egresses/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneEgress({ name })
    },

    '/zone-egresses/:name/data-path/:dataPath': (params: EnvoyDataParams, source: Closeable) => {
      source.close()

      const { name, dataPath } = params

      return api.getZoneEgressData({ zoneEgressName: name, dataPath })
    },

    '/zone-egress-overviews/:name': async (params: DetailParams, source: Closeable) => {
      source.close()

      const { name } = params

      return await api.getZoneEgressOverview({ name })
    },
  }
}
