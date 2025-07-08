import { token } from '@kumahq/kontainer'

import { XCopyButtonDebug } from '@/app/x'
import type { ServiceDefinition, Token } from '@kumahq/kontainer'

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
