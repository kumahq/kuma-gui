import { TarWriter } from '@gera2ld/tarjs'
import createClient from 'openapi-fetch'

import { ZoneEgressOverview, ZoneEgress } from './data'
import { YAML, defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  ZoneEgressOverview as PartialZoneEgressOverview,
  ZoneEgress as PartialZoneEgress,
} from '@/types/index.d'
import type { paths } from '@kumahq/kuma-http-api'


const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}
export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/zone-cps/:name/egresses': async (params) => {
      const { name, size, page } = params
      const filter = name !== '*' ? {
        [`labels.${'kuma.io/zone'}`]: name,
      } : undefined
      const offset = size * (page - 1)
      const search = ZoneEgressOverview.search(params.search)

      const res = await http.GET('/zone-egresses/_overview', {
        params: {
          query: {
            offset,
            filter,
            size,
            ...search,
          },
        },
      })

      return ZoneEgressOverview.fromCollection(res.data! as unknown as CollectionResponse<PartialZoneEgressOverview>)
    },

    '/zone-egresses/:name': async (params) => {
      const { name } = params
      const res = await http.GET('/zone-egresses/{name}', {
        params: {
          path: {
            name,
          },
        },
      })

      return ZoneEgress.fromObject(res.data! as unknown as PartialZoneEgress)
    },

    '/zone-egresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      const res = await http.GET('/zone-egresses/{name}', {
        params: {
          path: {
            name,
          },
          query: {
            format: 'kubernetes',
          },
        },
      })
      //TODO
      return res.data
    },

    '/zone-egresses/:name/as/tarball/:spec': async (params) => {
      const { name } = params
      const spec = JSON.parse(params.spec)
      // @TODO Should we add kubernetes yaml in here also?
      const requests = Object.entries(spec).filter(([_, value]) => {
        return value
      }).reduce((prev, [key]) => {
        switch (key) {
          case 'proxy':
            prev.push(async () => {
              const res = await http.GET('/zone-egresses/{name}', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'zone-egress.yaml',
                content: YAML.stringify(res.data),
              }
            })
            break
          case 'xds':
            prev.push(async () => {
              const res = await http.GET('/zoneegresses/{name}/xds', {
                params: {
                  path: {
                    name,
                  },
                  query: {
                    include_eds: spec.eds,
                  },
                },
              })
              return {
                name: 'xds.json',
                content: JSON.stringify(res.data, null, 2),
              }
            })
            break
          case 'stats':
            prev.push(async () => {
              const res = await http.GET('/zoneegresses/{name}/stats', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'stats.txt',
                content: res.data ?? '',
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              const res = await http.GET('/zoneegresses/{name}/clusters', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'clusters.txt',
                content: res.data ?? '',
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

    '/zone-egresses/:name/data-path/:dataPath': async (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'

      const res = await http.GET(`/zoneegresses/{name}/${dataPath}`, {
        params: {
          path: {
            name,
          },
        },
      })
      // TODO
      return res.data
    },

    '/zone-egress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      const res = await http.GET('/zone-egresses/_overview', {
        params: {
          query: {
            offset,
            size,
          },
        },
      })
      return ZoneEgressOverview.fromCollection(res.data! as unknown as CollectionResponse<PartialZoneEgressOverview>)
    },

    '/zone-egress-overviews/:name': async (params) => {
      const { name } = params
      const res = await http.GET('/zone-egresses/{name}/_overview', {
        params: {
          path: {
            name,
          },
        },
      })

      return ZoneEgressOverview.fromObject(res.data! as unknown as PartialZoneEgressOverview)
    },
  })
}
