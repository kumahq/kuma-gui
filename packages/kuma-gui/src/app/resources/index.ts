import { token } from '@kumahq/container'

import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>
type ResourcesSources = ReturnType<typeof sources>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token<ResourcesSources>('resources.sources'), {
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
