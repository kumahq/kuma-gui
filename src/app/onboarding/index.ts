import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('onboarding.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
  ]
}
