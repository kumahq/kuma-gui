import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('diagnostics.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('diagnostics.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
  ]
}
