import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>
type Sources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token<Sources>('mesh-trusts.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('mesh-trusts.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
