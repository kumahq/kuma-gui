import { StoreOptions } from 'vuex'

import { ConfigInterface } from './modules/config/config.types'
import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import { SidebarInterface } from './modules/sidebar/sidebar.types'
import { PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import type KumaApi from '@/services/kuma-api/KumaApi'
import config from '@/store/modules/config/config'
import onboarding from '@/store/modules/onboarding/onboarding'
import sidebar from '@/store/modules/sidebar/sidebar'
import { Mesh, PolicyType } from '@/types/index.d'
import { ClientStorage } from '@/utilities/ClientStorage'

/**
 * The root state of the application’s Vuex store minus all module state.
 */
interface BareRootState {
  menu: null
  globalLoading: boolean
  /**
   * Controls whether related pieces in the UI *may* be shown.
   *
   */
  defaultVisibility: {
    onboardingNotification: boolean
  }
  meshes: {
    items: Mesh[]
    total: number
    next: string | null
  }
  selectedMesh: string | null
  totalDataplaneCount: number
  version: string
  itemQueryNamespace: string
  policyTypes: PolicyType[]
  policyTypesByPath: Record<string, PolicyType | undefined>
  policyTypesByName: Record<string, PolicyType | undefined>
  globalKdsAddress: string
  currentMeshPolicies: Record<string, { total: number }>
}

const initialState: BareRootState = {
  menu: null,
  globalLoading: true,
  defaultVisibility: {
    onboardingNotification: true,
  },
  meshes: {
    total: 0,
    items: [],
    next: null,
  },
  selectedMesh: 'default',
  totalDataplaneCount: 0,
  version: '',
  itemQueryNamespace: 'item',
  policyTypes: [],
  policyTypesByPath: {},
  policyTypesByName: {},
  globalKdsAddress: 'grpcs://<global-kds-address>:5685',
  currentMeshPolicies: {},
}

/**
 * The root state of the application’s Vuex store including all module state.
 *
 * Module state is explicitly added because creating a store using modules needs it. By default, Vuex’s types for stores with namespaced modules will be incorrect.
 */
export interface State extends BareRootState {
  config: ConfigInterface
  sidebar: SidebarInterface
  onboarding: OnboardingInterface
}

export const storeConfig = (kumaApi: KumaApi): StoreOptions<State> => {
  return {
    modules: {
      sidebar: sidebar(kumaApi),
      config: config(kumaApi),
      onboarding,
    },

    // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
    state: () => initialState as State,

    getters: {
      globalLoading: state => state.globalLoading,

      shouldShowOnboardingNotification: (state) => {
        const hasOnlyDefaultMesh = state.meshes.items.length === 1 && state.meshes.items[0].name === 'default'

        return state.defaultVisibility.onboardingNotification && state.totalDataplaneCount === 0 && hasOnlyDefaultMesh
      },

      getMeshList: state => state.meshes,
      getItemQueryNamespace: state => state.itemQueryNamespace,
    },

    mutations: {
      SET_GLOBAL_LOADING: (state, globalLoading: typeof state.globalLoading) => (state.globalLoading = globalLoading),
      SET_MESHES: (state, meshes: typeof state.meshes) => (state.meshes = meshes),
      SET_SELECTED_MESH: (state, mesh: typeof state.selectedMesh) => (state.selectedMesh = mesh),
      SET_TOTAL_DATAPLANE_COUNT: (state, totalDataplaneCount: typeof state.totalDataplaneCount) => (state.totalDataplaneCount = totalDataplaneCount),
      SET_POLICY_TYPES: (state, policyTypes: typeof state.policyTypes) => {
        policyTypes.sort((policyTypeA, policyTypeB) => policyTypeA.name.localeCompare(policyTypeB.name))

        state.policyTypes = policyTypes
      },
      SET_POLICY_TYPES_BY_PATH: (state, policyTypesByPath: typeof state.policyTypesByPath) => (state.policyTypesByPath = policyTypesByPath),
      SET_POLICY_TYPES_BY_NAME: (state, policyTypesByName: typeof state.policyTypesByName) => (state.policyTypesByName = policyTypesByName),
      SET_GLOBAL_KDS_ADDRESS: (state, globalKdsAddress: typeof state.globalKdsAddress) => (state.globalKdsAddress = globalKdsAddress),
    },

    actions: {
      updateGlobalLoading({ commit }, isLoading: boolean) {
        commit('SET_GLOBAL_LOADING', isLoading)
      },

      async bootstrap({ dispatch, state }) {
        await Promise.all([
          dispatch('fetchMeshList'),
          dispatch('fetchDataplaneTotalCount'),
          dispatch('config/bootstrapConfig'),
        ])

        // Validates if stored mesh exists and fetches the relevant sidebar data.
        if (state.meshes.items.length > 0) {
          const newStoredMesh = ClientStorage.get('selectedMesh')
          let mesh: Mesh | undefined

          // If a selected mesh is stored, check if it actually exists and use it only if it does.
          if (newStoredMesh !== null) {
            const existingMesh = state.meshes.items.find((mesh) => mesh.name === newStoredMesh)

            if (existingMesh !== undefined) {
              mesh = existingMesh
            }
          }

          if (mesh === undefined) {
            // If the stored mesh doesn’t exist, use the first mesh instead.
            mesh = state.meshes.items[0]
          }

          await dispatch('updateSelectedMesh', mesh.name)
          await dispatch('sidebar/getInsights')
        } else {
          await dispatch('updateSelectedMesh', null)
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
        } catch (error) {
          console.error(error)
        }
      },

      updateSelectedMesh({ commit }, mesh: string | null) {
        if (mesh !== null) {
          ClientStorage.set('selectedMesh', mesh)
        } else {
          ClientStorage.remove('selectedMesh')
        }

        commit('SET_SELECTED_MESH', mesh)
      },

      async fetchDataplaneTotalCount({ commit }) {
        try {
          const response = await kumaApi.getAllDataplanes({ size: 1 })

          commit('SET_TOTAL_DATAPLANE_COUNT', response.total)
        } catch (error) {
          console.error(error)
        }
      },

      async fetchPolicyTypes({ commit }) {
        const { policies: policyTypes } = await kumaApi.getPolicyTypes()
        const policyTypesByPath = policyTypes.reduce((obj, policyType) => Object.assign(obj, { [policyType.path]: policyType }), {})
        const policyTypesByName = policyTypes.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})

        commit('SET_POLICY_TYPES', policyTypes)
        commit('SET_POLICY_TYPES_BY_PATH', policyTypesByPath)
        commit('SET_POLICY_TYPES_BY_NAME', policyTypesByName)
      },

      updateGlobalKdsAddress({ commit }, globalKdsAddress: string) {
        commit('SET_GLOBAL_KDS_ADDRESS', globalKdsAddress)
      },
    },
  }
}
