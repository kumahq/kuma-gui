import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
export * from './routes'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('connections.sources'), {
      service: (api: KumaApi) => sources({
        baseUrl: api.client.baseUrl,
        fetch: api.client.fetch,
      }),
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('connections.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
