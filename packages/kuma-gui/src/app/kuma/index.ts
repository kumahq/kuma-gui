import { token, createInjections } from '@kumahq/container'

import { vars } from './env'
import locales from './locales/en-us/index.yaml'
import { ValidationError } from '../application/services/data-source'
import KumaPort from '@/app/kuma/components/kuma-port/KumaPort.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { RestClient } from '@/app/kuma/services/kuma-api/RestClient'
import type { ServiceDefinition } from '@kumahq/container'
export * from './utils'
export { Kri } from './kri'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    KumaPort: typeof KumaPort
  }
}
export const TOKENS = {
  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
  htmlVars: token('kuma.html.vars'),
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

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
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
] = createInjections(
  TOKENS.api,
)
