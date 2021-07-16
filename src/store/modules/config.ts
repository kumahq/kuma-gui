import Kuma from '@/services/kuma'
import { StoreOptions, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '..'

export interface ConfigInterface {
  status: string | null
  environment: string | null
}

export type ConfigType = StoreOptions<ConfigInterface>

const state: ConfigInterface = {
  status: null,
  environment: null,
}

const mutations: MutationTree<ConfigInterface> = {
  SET_STATUS: (state, status: string) => (state.status = status),
  SET_ENVIRONMENT: (state, value) => (state.environment = value),
}

const getters: GetterTree<ConfigInterface, RootInterface> = {
  getStatus: (state) => state.status,
  getEnvironment: (state) => state.environment,
}

const actions:(api: Kuma) => ActionTree<ConfigInterface, RootInterface> = (api: Kuma) => ({
  // get the status of the API
  getStatus ({ commit }) {
    return api.getStatus()
      .then(response => {
        commit('SET_STATUS', response)
      })
  },
})

export default (api: Kuma) => ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions: actions(api)
})
