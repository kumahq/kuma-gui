import { ZoneIngressOverview, ZoneIngress } from './data'
import type { DataSourceResponse, Source } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    // doesn't resolve until we have at least one ingress and one ingress is online
    '/zone-ingress-overviews/~online': (params) => {
      const { size } = params
      const offset = size * (params.page - 1)
      const OfflineError = class extends Error { }
      return source(async () => {
        const res = ZoneIngressOverview.fromCollection(await api.getAllZoneIngressOverviews({ size, offset }))
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
    '/zone-cps/:name/ingresses': async (params) => {
      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneIngressOverviews({ size, offset })
      // temporary frontend filtering until we have support for filtering
      // 'gresses by zone in the backend. Until we have backend support its fine
      // to assume we won't need to recreate paging for 'gresses
      res.items = res.items.filter((item) => {
        return item.zoneIngress.zone === name
      })
      res.total = res.items.length
      return ZoneIngressOverview.fromCollection(res)
    },

    '/zone-ingresses/:name': async (params) => {
      const { name } = params

      return ZoneIngress.fromObject(await api.getZoneIngress({ name }))
    },

    '/zone-ingresses/:name/data-path/:dataPath': (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'
      return api.getZoneIngressData({ zoneIngressName: name, dataPath })
    },

    '/zone-ingresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      return await api.getZoneIngress({ name }, { format: 'kubernetes' })
    },

    '/zone-ingress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return ZoneIngressOverview.fromCollection(await api.getAllZoneIngressOverviews({ size, offset }))
    },

    '/zone-ingress-overviews/:name': async (params) => {
      const { name } = params

      return ZoneIngressOverview.fromObject(await api.getZoneIngressOverview({ name }))
    },
  })
}
