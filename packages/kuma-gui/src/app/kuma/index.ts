import Kongponents from '@kong/kongponents'
import { token, createInjections } from '@kumahq/container'
import { waitFor } from '@kumahq/data'
import X from '@kumahq/x'

import { vars } from './env'
import locales from './locales/en-us/index.yaml'
import { ValidationError } from '@/app/application'
import type { Can } from '@/app/application'
import { Kri } from '@/app/kuma'
import KumaPort from '@/app/kuma/components/kuma-port/KumaPort.vue'
import KumaTargetRef from '@/app/kuma/components/kuma-target-ref/KumaTargetRef.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { RestClient } from '@/app/kuma/services/kuma-api/RestClient'
import type { ServiceDefinition } from '@kumahq/container'
import type { DataSourcePool } from '@kumahq/data'
import type { Router } from 'vue-router'

export * from './utils'
export * from './kri'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    KumaPort: typeof KumaPort
    KumaTargetRef: typeof KumaTargetRef
  }
}
export const TOKENS = {
  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
  htmlVars: token('kuma.html.vars'),
  dataSource: token<<T>(src: string) => Promise<T>>('app.dataSource'),
}
function getConfig() {
  const pathConfigNode = document.querySelector('#kuma-config')
  if (pathConfigNode instanceof HTMLScriptElement && pathConfigNode.textContent) {
    const config = JSON.parse(pathConfigNode.textContent.trim())
    // Ensures the API baseUrl always has an absolute, non-trailing slash URL,
    // i.e. a base.
    // Chosen to be done here as this is the closest point to the backend we
    // can get
    config.apiUrl = normalizeBaseUrl(config.apiUrl)
    return config
  }
  const msg = 'Unable to parse kuma config. Please check your instance of kuma is running correctly'
  console.error(msg)
  throw new Error(msg)
}
function stripTrailingSlashes(url: string): string {
  return url.endsWith('/') ? stripTrailingSlashes(url.slice(0, -1)) : url
}
function normalizeBaseUrl(url: string): string {
  // this will likely never happen but if the URL isn't absolute then
  // make sure it begins with a `/`
  url = !url.includes('://') && !url.startsWith('/') ? `/${url}` : url
  return stripTrailingSlashes(url)
}

const protocolHandler = (can: Can, router: Router) => {
  return (href: string) => {
    const kriProto = 'kri://'
    switch (true) {
      case href.startsWith(kriProto): {
        const kri = href.substring(kriProto.length)
        const { mesh, name: encodedName, zone, namespace, shortName } = Kri.fromString(kri)
        // old style names can have _ in them that are replaced with `~`
        const name = encodedName.replaceAll('~', '_')
        const id = `${name}${namespace !== '' ? `.${namespace}`: '' }`
        const to = (() => {
          switch (true) {
            case shortName === 'm':
              return {
                name: 'mesh-detail-view',
                params: {
                  mesh: name,
                },
              }
            case shortName === 'z':
              if(can('use zones')) {
                return {
                  name: 'zone-cp-detail-view',
                  params: {
                    zone: kri,
                  },
                }
              }
              break
            case shortName === 'wl':
              return {
                name: 'workload-detail-view',
                params: {
                  wl: Kri.toString({ shortName, mesh, zone, namespace, name }),
                },
              }
            case shortName === '~hostport':
              return {
                name: 'data-plane-list-view',
                query: {
                  s: `tag:service:${name}`,
                },
              }
            case shortName === 'msvc':
              return {
                name: 'mesh-service-detail-view',
                params: {
                  mesh,
                  service: id,
                },
              }
            case shortName === 'mzsvc':
              return {
                name: 'mesh-multi-zone-service-detail-view',
                params: {
                  mesh: mesh,
                  service: id,
                },
              }
            case shortName === 'extsvc':
              return {
                name: 'mesh-external-service-detail-view',
                params: {
                  mesh: mesh,
                  service: id,
                },
              }
            case shortName === 'hg':
              return {
                name: 'hostname-generator-detail-view',
                params: {
                  kri,
                },
              }
            default:
              return
          }
        })()
        if (to) {
          try {
            return router.resolve(to).href
          } catch(e) {
            // log the error, don't throw it
            // anything errors we just don't show the link
            console.error(e)
            return ''
          }
        }
        return ''
      }
    }
    return href
  }

}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('kuma.plugins'), {
      service: (i18n, can, router) => {
        return [
          [Kongponents],
          [X, {
            i18n,
            protocolHandler: protocolHandler(can, router),
            routerElement: () => document.querySelector('.kuma-application'),
          }],
        ]
      },
      arguments: [
        app.i18n,
        app.can,
        app.router,
      ],
      labels: [
        app.plugins,
      ],
    }],
    [app.storagePrefix, {
      service: () => 'kumahq.kuma-gui',
    }],
    [app.htmlVars, {
      service: getConfig,
    }],
    [token('kuma.env.vars'), {
      service: vars,
      arguments: [
        app.htmlVars,
      ],
      labels: [
        app.vars,
      ],
    }],
    // KumaAPI
    [app.httpClient, {
      service: RestClient,
      arguments: [
        app.env,
      ],
    }],
    [app.api, {
      service: KumaApi,
      arguments: [
        app.httpClient,
        app.env,
      ],
    }],
    [app.dataSource, {
      service: (data: DataSourcePool) => {
        const fetch = async <T>(src: string): Promise<T> => {
          const sym = Symbol('')
          try {
            return waitFor(data.source(`${src}${src.includes('?') ? '&' : '?'}cacheControl=no-cache`, sym))
          } finally {
            data.close(src, sym)
          }
        }

        return fetch
      },
      arguments: [app.dataSourcePool],
    }],

    [token('kuma.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],

    [app.errorHandler, {
      service: () => {
        return (e: Error | ErrorEvent) => {
          const error = 'error' in e ? e.error : e
          if (error instanceof ApiError || error instanceof ValidationError) {
            return
          }
          console.error(error)
        }
      },
    }],

    [token('kuma.components.not-found'), {
      service: () => [
        () => import('@/app/kuma/views/KumaNotFoundView.vue'),
      ],
      labels: [
        app.notFoundView,
      ],
    }],

    [token('kuma.components'), {
      service: () => {
        return [
          ['KumaPort', KumaPort],
          ['KumaTargetRef', KumaTargetRef],
        ]
      },
      labels: [
        app.components,
      ],
    }],

  ]
}
export const [
  useKumaApi,
  useDataSource,
] = createInjections(
  TOKENS.api,
  TOKENS.dataSource,
)
