import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('hostname-generators.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('hostname-generators.routes'), {
      service: routes,
      arguments: [
        app.can,
      ],
      labels: [
        app.routes,
      ],
    }],
    [token('hostname-generators.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
