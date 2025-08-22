import { token } from '@kumahq/container'

import { features } from './features'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('zone-egresses.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
  ]
}
