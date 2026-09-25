import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('mesh-identities.sources'), {
      service: (fetch: typeof globalThis.fetch, env: Env) => sources({
        fetch,
        baseUrl: env('KUMA_API_URL'),
      }),
      arguments: [
        app.fetch,
        app.env,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('mesh-identities.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
