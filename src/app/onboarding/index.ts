import ControlPlaneStatusWithOnboarding from './components/ControlPlaneStatusWithOnboarding.vue'
import OnboardingIcon from './components/OnboardingIcon.vue'
import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token, service as set, createInjections } from '@/services/utils'

type Token = ReturnType<typeof token>

const ControlPlaneStatus = token('onboarding.components.ControlPlaneStatus')

const $ = {
  OnboardingIcon: token('onboarding.components.ControlPlaneIcon'),
}
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
    [$.OnboardingIcon, {
      service: () => {
        return OnboardingIcon
      },
    }],
  ]
}
export const TOKENS = $

export const [
  useControlPlaneStatus,
  useOnboardingIcon,
] = createInjections(
  ControlPlaneStatus,
  $.OnboardingIcon,
)
