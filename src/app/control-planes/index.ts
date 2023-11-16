import { features } from './features'
import { routes } from './routes'
import { sources } from './sources'
import ControlPlaneStatus from '@/app/control-planes/components/ControlPlaneStatus.vue'
import OnboardingAlert from '@/app/control-planes/components/OnboardingAlert.vue'
import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  sources: token<ReturnType<typeof sources>>('control-planes.sources'),
  ControlPlaneStatus: token<typeof ControlPlaneStatus>('control-planes.components.ControlPlaneStatus'),
  OnboardingAlert: token<typeof OnboardingAlert>('control-planes.components.OnboardingAlert'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.env,
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [$.ControlPlaneStatus, {
      service: () => {
        return ControlPlaneStatus
      },
    }],
    [$.OnboardingAlert, {
      service: () => {
        return OnboardingAlert
      },
    }],
    [token('control-planes.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
    [token('control-planes.features'), {
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

export const TOKENS = $
export const [
  useControlPlaneStatus,
  useOnboardingAlert,
] = createInjections(
  $.ControlPlaneStatus,
  $.OnboardingAlert,
)
