import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { ConfigInterface, ClientConfigInterface } from './config.types'
import { State } from '../../storeConfig'
import type KumaApi from '@/services/kuma-api/KumaApi'

const initialConfigState: ConfigInterface = {
  status: null,
  clientConfig: null,
}

const mutations: MutationTree<ConfigInterface> = {
  SET_CONFIG_DATA: (state, config: ClientConfigInterface) => (state.clientConfig = config),
  SET_STATUS: (state, status: 'OK' | null) => (state.status = status),
}

const getters: GetterTree<ConfigInterface, State> = {
  getStatus: state => state.status,
  getConfig: state => state.clientConfig,
  getConfigurationType: state => state.clientConfig?.store?.type,
}

const actions = (kumaApi: KumaApi): ActionTree<ConfigInterface, State> => ({
  bootstrapConfig({ dispatch }) {
    return dispatch('getConfig')
  },

  // get the general Kuma config (this differs from the API config endpoint)
  getConfig({ commit }) {
    return kumaApi.getConfig().then((response) => {
      commit('SET_CONFIG_DATA', response)
    })
  },

  // get the status of the API
  getStatus({ commit }) {
    return kumaApi.getStatus().then((response) => {
      commit('SET_STATUS', response)
    })
  },

})

export default (kumaApi: KumaApi) => {
  return {
    namespaced: true,
    state: () => initialConfigState,
    getters,
    mutations,
    actions: actions(kumaApi),
  }
}
