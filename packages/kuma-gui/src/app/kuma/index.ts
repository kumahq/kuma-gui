import Kongponents from '@kong/kongponents'
import { token, createInjections } from '@kumahq/container'
import { waitFor } from '@kumahq/data'
import X, { syntaxHighlighter } from '@kumahq/x'

import { vars } from './env'
import locales from './locales/en-us/index.yaml'
import { ValidationError } from '@/app/application'
import { Kri, createFetch } from '@/app/kuma'
import KumaPort from '@/app/kuma/components/kuma-port/KumaPort.vue'
import KumaResourceStatus from '@/app/kuma/components/kuma-resource-status/KumaResourceStatus.vue'
import KumaStatusBadge from '@/app/kuma/components/kuma-status-badge/KumaStatusBadge.vue'
import KumaTargetRef from '@/app/kuma/components/kuma-target-ref/KumaTargetRef.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import type { ServiceDefinition } from '@kumahq/container'
import type { DataSourcePool } from '@kumahq/data'
import type { Router, RouteLocationAsRelative } from 'vue-router'

export * from './utils'
export { Kri } from './kri'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    KumaPort: typeof KumaPort
    KumaResourceStatus: typeof KumaResourceStatus
    KumaTargetRef: typeof KumaTargetRef
    KumaKumaStatusBadge: typeof KumaStatusBadge
  }
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
type Handler = (item: { shortName: string, mesh: string, name: string, kri: string}) => RouteLocationAsRelative | undefined

const href = (router: Router) => (to: RouteLocationAsRelative) => {
  try {
    return router.resolve({
      params: router.currentRoute.value.params,
      ...to,
    }).href
  } catch(e) {
    if (e instanceof Error) {
      e.message = `${e.toString()}: ${JSON.stringify(to)}`
    }
    console.error(e)
  }
  return ''
}
const push = (router: Router) => (href: string) => {
  const base = router.options.history.base
  const h = href.startsWith(base) ? href.substring(base.length) : href
  return router.push(h.length > 0 ? h : '/')
}
export const TOKENS = {
  htmlVars: token('kuma.html.vars'),
  protocolHandler: token('kuma.protocolHandler'),
  kriHandlers: token('kuma.kriHandlers'),
  dataSource: token<<T>(src: string) => Promise<T>>('app.dataSource'),
  syntaxHighlighter: token('kuma.syntaxHighlighter'),
  href: token<ReturnType<typeof href>>('kuma.router.href'),
  routerPush: token<ReturnType<typeof push>>('kuma.router.push'),
  routerElement: token<() => HTMLElement | null>('kuma.router.element'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [app.protocolHandler, {
      service: (router: Router, handlers: Handler[]) => {
        return (href: string) => {
          const kriProto = 'kri://'
          switch (true) {
            // KRIs
            case href.startsWith(kriProto): {

              // add a default catchall to the end of the handlers
              handlers.push(
                ({ mesh, kri }) => {
                  // mesh-scoped resources live under a mesh, global-scoped
                  // resources are reachable via the top-level resources tab
                  return mesh.length > 0
                    ? {
                      name: 'mesh-resource-detail-view',
                      params: {
                        mesh,
                        kri,
                      },
                    }
                    : {
                      name: 'control-plane-resource-detail-view',
                      params: {
                        kri,
                      },
                    }
                },
              )
              //

              const item = Kri.fromString(href.substring(kriProto.length))
              // old style names can have _ in them that are replaced with `~`
              const name = item.name.replaceAll('~', '_')
              const kri = Kri.toString({
                ...item,
                name,
              })
              const args = {
                ...item,
                name,
                kri,
              }

              const to = handlers.reduce((prev, handler) => {
                return typeof prev === 'undefined' ? handler(args) : prev
              }, undefined as ReturnType<Handler>)

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
          // if its not a KRI just pass it back
          return href
        }
      },
      arguments: [
        app.router,
        app.kriHandlers,
      ],
    }],
    [app.kriHandlers, {
      service: () => [],
    }],
    [token('kuma.plugins'), {
      service: (i18n, syntaxHighlighter, protocolHandler, href, push, routerElement) => {
        return [
          [Kongponents],
          [X, {
            i18n,
            syntaxHighlighter,
            protocolHandler,
            href,
            push,
            routerElement,
          }],
        ]
      },
      arguments: [
        app.i18n,
        app.syntaxHighlighter,
        app.protocolHandler,
        app.href,
        app.routerPush,
        app.routerElement,
      ],
      labels: [
        app.plugins,
      ],
    }],
    [app.storagePrefix, {
      service: () => 'kumahq.kuma-gui',
    }],
    [app.fetch, {
      service: () => createFetch(fetch),
    }],
    [app.routerElement, {
      service: () => () => document.querySelector('.kuma-application'),
    }],
    [app.href, {
      service: href,
      arguments: [
        app.router,
      ],
    }],
    [app.routerPush, {
      service: push,
      arguments: [
        app.router,
      ],
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

    [app.syntaxHighlighter, {
      service: () => syntaxHighlighter,
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
          ['KumaResourceStatus', KumaResourceStatus],
          ['KumaTargetRef', KumaTargetRef],
          ['KumaStatusBadge', KumaStatusBadge],
        ]
      },
      labels: [
        app.components,
      ],
    }],

  ]
}
export const [
  useDataSource,
] = createInjections(
  TOKENS.dataSource,
)
