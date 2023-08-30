import {
  NavigationGuard,
} from 'vue-router'
import { Store } from 'vuex'

import { onboardingRouteGuard } from './guards'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'
import type { State } from '@/store/storeConfig'
export * from './routes'

type Token = ReturnType<typeof token>

const $ = {
  guards: token<NavigationGuard[]>('onboarding.guards'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
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
