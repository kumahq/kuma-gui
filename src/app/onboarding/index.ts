import {
  NavigationGuard,
} from 'vue-router'
import { Store } from 'vuex'

import { onboardingRouteGuard } from './guards'
import { routes } from './routes'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'
import type { State } from '@/store/storeConfig'

type Token = ReturnType<typeof token>

const $ = {
  routes: token<ReturnType<typeof routes>>('diagnostics.routes'),
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
    [$.guards, {
      service: (store: Store<State>) => {
        return [
          onboardingRouteGuard(store),
        ]
      },
      arguments: [
        app.store,
      ],
      labels: [
        app.navigationGuards,
      ],
    }],

  ]
}

export const TOKENS = $
