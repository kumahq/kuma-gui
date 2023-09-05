import { StoreOptions } from 'vuex'

import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import onboarding from '@/store/modules/onboarding/onboarding'

/**
 * The root state of the application’s Vuex store minus all module state.
 */
interface BareRootState {
  globalLoading: boolean
  globalKdsAddress: string
}

const initialState: BareRootState = {
  globalLoading: true,
  globalKdsAddress: 'grpcs://<global-kds-address>:5685',
}

/**
 * The root state of the application’s Vuex store including all module state.
 *
 * Module state is explicitly added because creating a store using modules needs it. By default, Vuex’s types for stores with namespaced modules will be incorrect.
 */
export interface State extends BareRootState {
  onboarding: OnboardingInterface
}

export const storeConfig = (): StoreOptions<State> => {
  return {
    modules: {
      onboarding,
    },

    // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
    state: () => initialState as State,

    mutations: {
      SET_GLOBAL_LOADING: (state, globalLoading: typeof state.globalLoading) => (state.globalLoading = globalLoading),
      SET_GLOBAL_KDS_ADDRESS: (state, globalKdsAddress: typeof state.globalKdsAddress) => (state.globalKdsAddress = globalKdsAddress),
    },

    actions: {
      updateGlobalLoading({ commit }, isLoading: boolean) {
        commit('SET_GLOBAL_LOADING', isLoading)
      },

      updateGlobalKdsAddress({ commit }, globalKdsAddress: string) {
        commit('SET_GLOBAL_KDS_ADDRESS', globalKdsAddress)
      },
    },
  }
}
