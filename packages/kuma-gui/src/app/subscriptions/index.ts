import { token } from '@kumahq/container'

import locales from './locales/en-us/index.yaml'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('subscriptions.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
