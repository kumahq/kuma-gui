import { StoreOptions } from 'vuex'

import type { OnboardingInterface } from './modules/onboarding/onboarding.types'
import { PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import { getPathConfigDefault } from '@/pathConfigDefault'
import type KumaApi from '@/services/kuma-api/KumaApi'
import onboarding from '@/store/modules/onboarding/onboarding'
import type { Mesh } from '@/types/index.d'

const { environment, mode } = getPathConfigDefault()

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
    onboardingNotification: boolean
  }
  meshes: {
    items: Mesh[]
    total: number
    next: string | null
  }
  totalDataplaneCount: number
  globalKdsAddress: string
  apiStatus: 'OK' | null
  environment: 'universal' | 'kubernetes'
  mode: 'standalone' | 'global'
  configurationType: 'memory' | 'kubernetes' | 'postgres'
}

const initialState: BareRootState = {
  globalLoading: true,
  defaultVisibility: {
    appError: true,
    onboardingNotification: true,
  },
  meshes: {
    total: 0,
    items: [],
    next: null,
  },
  totalDataplaneCount: 0,
  globalKdsAddress: 'grpcs://<global-kds-address>:5685',
  apiStatus: null,
  environment,
  mode,
  configurationType: 'kubernetes',
}

/**
 * The root state of the application’s Vuex store including all module state.
 *
 * Module state is explicitly added because creating a store using modules needs it. By default, Vuex’s types for stores with namespaced modules will be incorrect.
 */
export interface State extends BareRootState {
  onboarding: OnboardingInterface
}

export const storeConfig = (kumaApi: KumaApi): StoreOptions<State> => {
  return {
    modules: {
      onboarding,
    },

    // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
    state: () => initialState as State,

    getters: {
      shouldShowAppError: (state) => {
        return state.defaultVisibility.appError && state.apiStatus !== 'OK'
      },

      shouldShowOnboardingNotification: (state) => {
        const hasOnlyDefaultMesh = state.meshes.items.length === 1 && state.meshes.items[0].name === 'default'

        return state.defaultVisibility.onboardingNotification && state.totalDataplaneCount === 0 && hasOnlyDefaultMesh
      },
    },

    mutations: {
      SET_GLOBAL_LOADING: (state, globalLoading: typeof state.globalLoading) => (state.globalLoading = globalLoading),
      SET_MESHES: (state, meshes: typeof state.meshes) => (state.meshes = meshes),
      SET_TOTAL_DATAPLANE_COUNT: (state, totalDataplaneCount: typeof state.totalDataplaneCount) => (state.totalDataplaneCount = totalDataplaneCount),
      SET_GLOBAL_KDS_ADDRESS: (state, globalKdsAddress: typeof state.globalKdsAddress) => (state.globalKdsAddress = globalKdsAddress),
      SET_API_STATUS: (state, apiStatus: typeof state.apiStatus) => (state.apiStatus = apiStatus),
      SET_ENVIRONMENT: (state, environment: typeof state.environment) => (state.environment = environment),
      SET_MODE: (state, mode: typeof state.mode) => (state.mode = mode),
      SET_CONFIGURATION_TYPE: (state, configurationType: typeof state.configurationType) => (state.configurationType = configurationType),
    },

    actions: {
      updateGlobalLoading({ commit }, isLoading: boolean) {
        commit('SET_GLOBAL_LOADING', isLoading)
      },

      async bootstrap({ commit, dispatch }) {
        const apiStatus = await kumaApi.getStatus()
        commit('SET_API_STATUS', apiStatus)

        // only dispatch these actions if the Kuma is online
        if (apiStatus === 'OK') {
          await Promise.all([
            dispatch('fetchMeshList'),
            dispatch('fetchDataplaneTotalCount'),
            dispatch('fetchClientConfig'),
          ])
        }
      },

      async fetchClientConfig({ commit }) {
        try {
          const config = await kumaApi.getConfig()

          commit('SET_ENVIRONMENT', config.environment)
          commit('SET_MODE', config.mode)
          commit('SET_CONFIGURATION_TYPE', config.store?.type)
        } catch {
          // Let’s keep the default values
        }
      },

      async fetchMeshList({ commit, state }) {
        const params = {
          size: PAGE_REQUEST_SIZE_DEFAULT,
        }

        try {
          const { total, items, next } = await kumaApi.getAllMeshes(params)
          const meshes: typeof state.meshes = { items: items ?? [], total, next }

          meshes.items.sort((meshA, meshB) => {
            // Prioritizes the mesh named “default”.
            if (meshA.name === 'default') {
              return -1
            } else if (meshB.name === 'default') {
              return 1
            }

            return meshA.name.localeCompare(meshB.name)
          })

          commit('SET_MESHES', meshes)
        } catch {
          // Let’s keep the default values
        }
      },

      async fetchDataplaneTotalCount({ commit }) {
        try {
          const response = await kumaApi.getAllDataplanes({ size: 1 })

          commit('SET_TOTAL_DATAPLANE_COUNT', response.total)
        } catch {
          // Let’s keep the default values
        }
      },

      updateGlobalKdsAddress({ commit }, globalKdsAddress: string) {
        commit('SET_GLOBAL_KDS_ADDRESS', globalKdsAddress)
      },
    },
  }
}
