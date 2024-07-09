import XCopyButtonDebug from './components/x-copy-button/XCopyButtonDebug.vue'
import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('development.components'), {
    service: () => {
      return [
        ['XCopyButton', XCopyButtonDebug],
      ]
    },
    labels: [
      app.components,
    ],
  }],
]
