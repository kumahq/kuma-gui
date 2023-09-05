import {
  NavigationGuard,
} from 'vue-router'

import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

const $ = {
  routes: token<ReturnType<typeof routes>>('onboarding.routes'),
  guards: token<NavigationGuard[]>('onboarding.guards'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.routes, {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
  ]
}

export const TOKENS = $
