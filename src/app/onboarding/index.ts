import ControlPlaneStatusWithOnboarding from './components/ControlPlaneStatusWithOnboarding.vue'
import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token, service as set, createInjections } from '@/services/utils'

type Token = ReturnType<typeof token>

const ControlPlaneStatus = token('onboarding.components.ControlPlaneStatus')

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('onboarding.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
    [token('onboarding.components.ControlPlaneStatusWithOnboarding'), {
      service: (service) => {
        set(ControlPlaneStatus, { service })
        return ControlPlaneStatusWithOnboarding
      },
      decorates: app.ControlPlaneStatus,
    }],
  ]
}

export const [
  useControlPlaneStatus,
] = createInjections(
  ControlPlaneStatus,
)
