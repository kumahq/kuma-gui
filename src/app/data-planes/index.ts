import { features } from './features'
import { routes } from './routes'
import { sources } from './sources'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('data-planes.sources'), {
      service: sources,
      arguments: [
        app.source,
        app.api,
        app.can,
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
    ...connections(app),
  ]
}
