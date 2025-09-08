import { token } from '@kumahq/container'
import { XCopyButtonDebug } from '@kumahq/x'

import type { ServiceDefinition, Token } from '@kumahq/container'

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('development.components'), {
    service: () => {
      return [
        (name: string, item: unknown) => {
          if (name === 'XCopyButton') {
            return [name, XCopyButtonDebug]
          }
          return [name, item]
        },
      ]
    },
    labels: [
      app.componentWalkers,
    ],
  }],
]
