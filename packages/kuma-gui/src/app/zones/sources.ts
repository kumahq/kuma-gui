import createClient from 'openapi-fetch'

import { ZoneOverview } from './data'
import { Kri } from '../kuma'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
export type { ZoneOverview } from './data'
import type { paths, components } from '@kumahq/kuma-http-api'

type KumaZoneOverview = components['schemas']['ZoneOverviewWithMeta']

export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

type Options = {
  baseUrl: string
  fetch: typeof fetch
}
export const sources = ({ baseUrl, fetch }: Options) => {
  const http = createClient<paths>({
    baseUrl,
    fetch,
  })
  return defineSources({
    '/zone-cps': async (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      const search = ZoneOverview.search(params.search)

      const res = await http.GET('/zones/_overview', {
        params: {
          // @ts-expect-error
          query: {
            offset,
            size,
            ...search,
          },
        },
      })


      return ZoneOverview.fromCollection(res.data as unknown as CollectionResponse<KumaZoneOverview>)
    },
    '/zone-cps/:kri': async (params) => {
      const { kri } = params
      const { name } = Kri.fromString(kri)
      const res = await http.GET('/zones/{name}/_overview', {
        params: {
          path: {
            name,
          },
        },
      })
      return ZoneOverview.fromObject(res.data as unknown as KumaZoneOverview)
    },
  })
}
