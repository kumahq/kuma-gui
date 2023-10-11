import { features } from './features'
import { routes, actions } from './routes'
import { sources } from './sources'
import type { Can } from '@/app/application/services/can'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('zones.routes'), {
      service: (can: Can) => {
        return routes(can('create zones') ? actions() : [], can)
      },
      arguments: [
        app.can,
      ],
      labels: [
        app.routes,
      ],
    }],
    [token('zone.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('zone.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
  ]
}
