import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  sources: token<ReturnType<typeof sources>>('diagnostics.sources'),
  routes: token<ReturnType<typeof routes>>('diagnostics.routes'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [$.routes, {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
  ]
}

export const TOKENS = $
