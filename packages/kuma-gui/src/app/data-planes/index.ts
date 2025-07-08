import { token } from '@kumahq/kontainer'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/kontainer'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('data-planes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('data-planes.routes'), {
      service: () => {
        return [routes()]
      },
      labels: [
        app.routes,
      ],
    }],
    [token('data-planes.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('data-planes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...connections(app),
  ]
}
