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
}

const getters: GetterTree<ConfigInterface, State> = {
  getConfig: state => state.clientConfig,
  getEnvironment: state => state.clientConfig?.environment,
  getMode: state => state.clientConfig?.mode,
  getConfigurationType: state => state.clientConfig?.store?.type,
  getMulticlusterStatus: (_state, getters) => {
    return getters.getMode === 'global'
  },
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
