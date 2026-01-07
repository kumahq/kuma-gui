import { token } from '@kumahq/container'

import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('mesh-identities.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('mesh-identities.routes'), {
      service: () => routes,
      labels: [
        app.exports,
      ],
    }],
  ]
}
