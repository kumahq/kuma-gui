import { token} from '@kumahq/container'

import type { ServiceDefinition, Token } from '@kumahq/container'

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('meshes.env.vars'), {
    service: () => {
      return {
        KUMA_RESOURCES_ROUTE_ENABLED: () => 'true',
      }
    },
    labels: [
      app.vars,
    ],
  }],
]
