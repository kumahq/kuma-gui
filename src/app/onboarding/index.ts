import OnboardingAlert from './components/OnboardingAlert.vue'
import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token, createInjections } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  OnboardingAlert: token<typeof OnboardingAlert>('control-planes.components.OnboardingAlert'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.OnboardingAlert, {
      service: () => {
        return OnboardingAlert
      },
    }],
    [token('onboarding.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
  ]
}

export const TOKENS = $
export const [
  useOnboardingAlert,
] = createInjections(
  $.OnboardingAlert,
)
