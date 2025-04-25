import { XCopyButtonDebug } from '@/app/x'
import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'

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
