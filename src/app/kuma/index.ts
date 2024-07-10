import type { EnvArgs } from '@/app/application/services/env/Env'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { RestClient } from '@/app/kuma/services/kuma-api/RestClient'
import i18nEnUs from '@/locales/en-us'
import { token, createInjections } from '@/services/utils'
import type { ServiceDefinition } from '@/services/utils'

type Token = ReturnType<typeof token>

export const TOKENS = {
  httpClient: token<RestClient>('httpClient'),
  api: token<KumaApi>('KumaApi'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [app.storagePrefix, {
      service: () => 'kumahq.kuma-gui',
    }],
    [app.EnvVars, {
      constant: {
        KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
        KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
        KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
        KUMA_MOCK_API_ENABLED: import.meta.env.VITE_MOCK_API_ENABLED,
        KUMA_ZONE_CREATION_FLOW: import.meta.env.VITE_ZONE_CREATION_FLOW,
      } as EnvArgs,
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

    [token('kuma.i18n.en-us'), {
      constant: i18nEnUs,
      labels: [
        app.enUs,
      ],
    }],

    [app.errorHandler, {
      service: () => {
        return (e: Error | ErrorEvent) => {
          const error = 'error' in e ? e.error : e
          if (error instanceof ApiError) {
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
  ]
}
export const [
  useKumaApi,
] = createInjections(
  TOKENS.api,
)
