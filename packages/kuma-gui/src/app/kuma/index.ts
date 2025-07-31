import { token, createInjections } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { ValidationError } from '../application/services/data-source'
import KumaPort from '@/app/kuma/components/kuma-port/KumaPort.vue'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { RestClient } from '@/app/kuma/services/kuma-api/RestClient'
import type { ServiceDefinition } from '@kumahq/container'
import type { EnvArgs } from '@kumahq/settings/env'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    KumaPort: typeof KumaPort
  }
}
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
        KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
        KUMA_MOCK_API_ENABLED: import.meta.env.VITE_MOCK_API_ENABLED,
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
