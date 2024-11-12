import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('policies.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('policies.routes'), {
      service: () => {
        return [routes()]
      },
      labels: [
        app.routes,
      ],
    }],
    [token('policies.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
