import { features } from './features'
import { routes } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application/services/can'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

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
      labels: [
        app.features,
      ],
    }],

  ]
}
