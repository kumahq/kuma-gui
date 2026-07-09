import { token } from '@kumahq/container'

import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('me.sources'), {
      service: sources,
      arguments: [
        app.storage,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
