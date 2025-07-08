import { token } from '@kumahq/kontainer'

import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/kontainer'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('rules.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
