import { TarWriter } from '@gera2ld/tarjs'
import createClient from 'openapi-fetch'

import { ZoneIngressOverview, ZoneIngress } from './data'
import type { DataSourceResponse } from '@/app/application'
import { YAML, defineSources } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type { paths } from '@kumahq/kuma-http-api'

const includes = <T extends readonly string[]>(arr: T, item: string): item is T[number] => {
  return arr.includes(item as T[number])
}

export type ZoneIngressOverviewCollection = CollectionResponse<ZoneIngressOverview>
export type ZoneIngressOverviewSource = DataSourceResponse<ZoneIngressOverview>
export type ZoneIngressOverviewCollectionSource = DataSourceResponse<ZoneIngressOverviewCollection>

export type EnvoyDataSource = DataSourceResponse<object | string>

export const sources = (api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: api.client.baseUrl,
    fetch: api.client.fetch,
  })
  return defineSources({
    '/zone-cps/:name/ingresses': async (params) => {
      const { name, size, page } = params
      const filter = {
        [`labels.${'kuma.io/zone'}`]: name,
      }
      const search = ZoneIngressOverview.search(params.search)
      const offset = size * (page - 1)

      const res = await http.GET('/zone-ingresses/_overview', {
        params: {
          query: {
            offset,
            filter,
            size,
            ...search,
          },
        },
      })

      return ZoneIngressOverview.fromCollection(res.data!)
    },

    '/zone-ingresses/:name': async (params) => {
      const { name } = params
      const res = await http.GET('/zone-ingresses/{name}', {
        params: {
          path: {
            name,
          },
        },
      })

      return ZoneIngress.fromObject(res.data!)
    },

    '/zone-ingresses/:name/data-path/:dataPath': async (params) => {
      const { name } = params
      const dataPath = includes(['xds', 'clusters', 'stats'] as const, params.dataPath) ? params.dataPath : 'xds'
      const res = await http.GET(`/zoneingresses/{name}/${dataPath}`, {
        params: {
          path: {
            name,
          },
        },
      })
      // TODO
      return res.data
    },

    '/zone-ingresses/:name/as/kubernetes': async (params) => {
      const { name } = params

      const res = await http.GET('/zone-ingresses/{name}', {
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

    '/zone-ingresses/:name/as/tarball/:spec': async (params) => {
      const { name } = params
      const spec = JSON.parse(params.spec)
      // @TODO Should we add kubernetes yaml in here also?
      const requests = Object.entries(spec).filter(([_, value]) => {
        return value
      }).reduce((prev, [key]) => {
        switch (key) {
          case 'proxy':

            prev.push(async () => {
              const res = await http.GET('/zone-ingresses/{name}', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'zone-ingress.yaml',
                content: YAML.stringify(res.data),
              }
            })
            break
          case 'xds':
            prev.push(async () => {
              const res = await http.GET('/zoneingresses/{name}/xds', {
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
              const res = await http.GET('/zoneingresses/{name}/stats', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'stats.txt',
                // TODO
                content: res.data as string,
              }
            })
            break
          case 'clusters':
            prev.push(async () => {
              const res = await http.GET('/zoneingresses/{name}/clusters', {
                params: {
                  path: {
                    name,
                  },
                },
              })
              return {
                name: 'clusters.txt',
                // TODO
                content: res.data as string,
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


    '/zone-ingress-overviews': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)

      const res = await http.GET('/zone-ingresses/_overview', {
        params: {
          query: {
            offset,
            size,
          },
        },
      })


      return ZoneIngressOverview.fromCollection(res.data!)
    },

    '/zone-ingress-overviews/:name': async (params) => {
      const { name } = params
      const res = await http.GET('/zone-ingresses/{name}/_overview', {
        params: {
          path: {
            name,
          },
        },
      })

      return ZoneIngressOverview.fromObject(res.data!)
    },
  })
}
