import Kuma from '@/services/kuma'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '../..'
import { ConfigInterface, ConfigType } from './config.types'

const state: ConfigInterface = {
  status: null,
  tagline: null,
  version: null,
  clientConfig: null
}

const mutations: MutationTree<ConfigInterface> = {
  SET_CONFIG_DATA: (state, config) => (state.clientConfig = config),
  SET_STATUS: (state, status) => (state.status = status),
  SET_TAGLINE: (state, tagline) => (state.tagline = tagline),
  SET_VERSION: (state, version) => (state.version = version),
}

const getters: GetterTree<ConfigInterface, RootInterface> = {
  getStatus: (state) => state.status,
  getConfig: (state) => state.clientConfig,
  getEnvironment: (state) => state.clientConfig?.environment,
  getMode: (state) => state.clientConfig?.mode,
  getTagline: (state) => state.tagline,
  getVersion: (state) => state.version,
  getMulticlusterStatus: (state, getters) => {
    // is Kuma running in Multi-Zone mode?

    let status

    if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_FAKE_MULTIZONE === 'true') {
      status = true

      console.warn(
        '%c ✨You are currently faking Multi-Zone mode.',
        'background: black; color: white; display: block; padding: 0.25rem;'
      )
    } else {
      status = getters.getMode === 'global'
    }

    return status
  },
}

const actions:(api: Kuma) => ActionTree<ConfigInterface, RootInterface> = (api: Kuma) => ({

  // get the general Kuma config (this differs from the API config endpoint)
  getConfig ({ commit }) {
    return api.getConfig()
      .then(response => {
        commit('SET_CONFIG_DATA', response)
      })
  },

  // get the status of the API
  getStatus ({ commit }) {
    return api.getStatus()
      .then(response => {
        commit('SET_STATUS', response)
      })
  },

  // get the current tagline
  getTagline ({ commit }) {
    return api.getInfo()
      .then(response => {
        commit('SET_TAGLINE', response.tagline)
      })
      .catch(error => {
        console.error(error)
      })
  },

  // get the current version
  getVersion ({ commit }) {
    return api.getInfo()
      .then(response => {
        commit('SET_VERSION', response.version)
      })
      .catch(error => {
        console.error(error)
      })
  },
})

export default (api: Kuma): ConfigType => ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions: actions(api)
})
