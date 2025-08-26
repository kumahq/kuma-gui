import { token } from '@kumahq/container'

import { routes } from './routes'
import { services as connections } from '@/app/connections'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

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
    ...connections(app),
  ]
}
