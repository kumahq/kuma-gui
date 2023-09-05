import { StoreOptions } from 'vuex'

import { ConfigInterface } from './modules/config/config.types'
import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import type KumaApi from '@/services/kuma-api/KumaApi'
import config from '@/store/modules/config/config'
import onboarding from '@/store/modules/onboarding/onboarding'

/**
 * The root state of the application’s Vuex store minus all module state.
 */
interface BareRootState {
  globalLoading: boolean
  /**
   * Controls whether related pieces in the UI *may* be shown.
   */
  defaultVisibility: {
    appError: boolean
  }
  globalKdsAddress: string
}

const initialState: BareRootState = {
  globalLoading: true,
  defaultVisibility: {
    appError: true,
  },
  globalKdsAddress: 'grpcs://<global-kds-address>:5685',
}

/**
 * The root state of the application’s Vuex store including all module state.
 *
 * Module state is explicitly added because creating a store using modules needs it. By default, Vuex’s types for stores with namespaced modules will be incorrect.
 */
export interface State extends BareRootState {
  config: ConfigInterface
  onboarding: OnboardingInterface
}

export const storeConfig = (kumaApi: KumaApi): StoreOptions<State> => {
  return {
    modules: {
      config: config(kumaApi),
      onboarding,
    },

    // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
    state: () => initialState as State,

    getters: {
      shouldShowAppError: (state) => {
        return state.defaultVisibility.appError && state.config.status !== 'OK'
      },
    },

    mutations: {
      SET_GLOBAL_LOADING: (state, globalLoading: typeof state.globalLoading) => (state.globalLoading = globalLoading),
      SET_GLOBAL_KDS_ADDRESS: (state, globalKdsAddress: typeof state.globalKdsAddress) => (state.globalKdsAddress = globalKdsAddress),
    },

    actions: {
      updateGlobalLoading({ commit }, isLoading: boolean) {
        commit('SET_GLOBAL_LOADING', isLoading)
      },

      async bootstrap({ dispatch, getters }) {
        // check the Kuma status before we do anything else
        await dispatch('config/getStatus')

        // only dispatch these actions if the Kuma is online
        if (getters['config/getStatus'] === 'OK') {
          await Promise.all([
            dispatch('config/bootstrapConfig'),
          ])
        }
      },

      updateGlobalKdsAddress({ commit }, globalKdsAddress: string) {
        commit('SET_GLOBAL_KDS_ADDRESS', globalKdsAddress)
      },
    },
  }
}
