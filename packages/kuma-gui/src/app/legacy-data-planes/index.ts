import { token } from '@kumahq/container'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>
type DataplaneSources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('legacy.data-planes.routes'), {
      service: () => {
        return [routes()]
      },
      labels: [
        app.routes,
      ],
    }],
    [token<DataplaneSources>('legacy.data-planes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('legacy.data-planes.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('legacy.data-planes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...connections(app),
  ]
}
