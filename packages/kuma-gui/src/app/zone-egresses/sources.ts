import { TarWriter } from '@gera2ld/tarjs'

import { ZoneEgressOverview, ZoneEgress } from './data'
import { YAML } from '@/app/application'
import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'

export type ZoneEgressSource = DataSourceResponse<ZoneEgress>
export type ZoneEgressOverviewCollection = CollectionResponse<ZoneEgressOverview>
export type ZoneEgressOverviewSource = DataSourceResponse<ZoneEgressOverview>
export type ZoneEgressOverviewCollectionSource = DataSourceResponse<ZoneEgressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
export const sources = (api: KumaApi) => {
  return defineSources({
    '/zone-cps/:name/egresses': async (params) => {
      const { name, size, page } = params
      const offset = size * (page - 1)

      const res = await api.getAllZoneEgressOverviews({ size, offset })
      if (name !== '*') {
        // temporary frontend filtering until we have support for filtering
        // 'gresses by zone in the backend. Until we have backend support its fine
        // to assume we won't need to recreate paging for 'gresses
        res.items = res.items.filter((item) => {
          return item.zoneEgress.zone === name
        })
        res.total = res.items.length
      }
      return ZoneEgressOverview.fromCollection(res)
    },

    '/zone-egresses/:name': async (params) => {
      const { name } = params

      return ZoneEgress.fromObject(await api.getZoneEgress({ name }))
    },

    '/zone-egresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      return await api.getZoneEgress({ name }, { format: 'kubernetes' })
    },

    '/zone-egresses/:name/as/tarball/:spec': async (params) => {
      const { name } = params
      const spec = JSON.parse(params.spec)
      const requests = Object.entries(spec).filter(([_, value]) => {
        return value
      }).reduce((prev, [key]) => {
        switch (key) {
          case 'proxy':
            prev.push(async () => {
              return {
                name: 'zone-egress.yaml',
                content: YAML.stringify(await api.getZoneEgress({ name })),
              }
            })
            break
          case 'xds':
            prev.push(async () => {
              return {
                name: 'xds.json',
                content: JSON.stringify(await api.getZoneEgressXds({
                  name,
                }, {
                  include_eds: spec.eds,
                }), null, 2),
              }
            })
            break
          case 'stats':
            prev.push(async () => {
              return {
                name: 'stats.txt',
                content: await api.getZoneEgressStats({
                  name,
                }),
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              return {
                name: 'clusters.txt',
                content: await api.getZoneEgressClusters({
                  name,
                }),
              }
            })
            break
        }
        return prev
      }, [] as (() => Promise<{ name: string, content: string }>)[])

      const files = await Promise.all(requests.map(item => item()))
      const tarball = new TarWriter()
      const id = `${name}`
      files.forEach(({ name, content }) => {
        tarball.addFile(`${id}/${name}`, content)
      })
      return {
        name: `${id}.tar`,
        url: URL.createObjectURL(new Blob([await tarball.write()], { type: 'application/tar' })),
      }
    },

    '/zone-egresses/:name/data-path/:dataPath': (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'

      return api.getZoneEgressData({ zoneEgressName: name, dataPath })
    },

    '/zone-egress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      return ZoneEgressOverview.fromCollection(await api.getAllZoneEgressOverviews({ size, offset }))
    },

    '/zone-egress-overviews/:name': async (params) => {
      const { name } = params

      return ZoneEgressOverview.fromObject(await api.getZoneEgressOverview({ name }))
    },
  })
}
