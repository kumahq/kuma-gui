import createClient from 'openapi-fetch'

import { ZoneOverview } from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { sources as zoneEgresses } from '@/app/zone-egresses/sources'
import { sources as zoneIngresses } from '@/app/zone-ingresses/sources'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
export type { ZoneOverview } from './data'
import type {
  ZoneOverview as PartialZoneOverview,
} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'



export type ZoneOverviewCollection = CollectionResponse<ZoneOverview>
export type ZoneOverviewSource = DataSourceResponse<ZoneOverview>
export type ZoneOverviewCollectionSource = DataSourceResponse<ZoneOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })
  return defineSources({
    ...zoneIngresses(api),
    ...zoneEgresses(api),

    '/zone-cps': async (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      const search = ZoneOverview.search(params.search)

      const res = await http.GET('/zones/_overview', {
        params: {
          query: {
            offset,
            size,
            ...search,
          },
        },
      })


      return ZoneOverview.fromCollection(res.data as unknown as CollectionResponse<PartialZoneOverview>)
    },
    '/zone-cps/:name': async (params) => {
      const { name } = params
      const res = await http.GET('/zones/{name}/_overview', {
        params: {
          path: {
            name,
          },
        },
      })
      return ZoneOverview.fromObject(res.data as unknown as PartialZoneOverview)
    },
  })
}
