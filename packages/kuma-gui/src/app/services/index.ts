import { token } from '@kumahq/container'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('services.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('services.routes'), {
      service: (can: Can) => {
        return [routes(can)]
      },
      arguments: [
        app.can,
      ],
      labels: [
        app.routes,
      ],
    }],
    [token('services.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('services.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],

  ]
}
