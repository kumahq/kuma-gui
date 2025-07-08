import { token } from '@kumahq/kontainer'

import locales from './locales/en-us/index.yaml'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/kontainer'
export * from './routes'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('connections.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('connections.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
