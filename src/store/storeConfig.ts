import { StoreOptions } from 'vuex'

import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import onboarding from '@/store/modules/onboarding/onboarding'

export interface State {
  onboarding: OnboardingInterface
}

export const storeConfig = (): StoreOptions<State> => {
  return {
    modules: {
      onboarding,
    },
  }
}
