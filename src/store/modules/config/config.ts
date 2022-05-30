import Kuma from '@/services/kuma'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '../..'
import { ConfigInterface } from './config.types'

const state: ConfigInterface = {
  status: null,
  tagline: null,
  version: null,
  clientConfig: null,
}

const mutations: MutationTree<ConfigInterface> = {
  SET_CONFIG_DATA: (state, config) => (state.clientConfig = config),
  SET_STATUS: (state, status) => (state.status = status),
  SET_TAGLINE: (state, tagline) => (state.tagline = tagline),
  SET_VERSION: (state, version) => (state.version = version),
}

const getters: GetterTree<ConfigInterface, RootInterface> = {
  getStatus: state => state.status,
  getConfig: state => state.clientConfig,
  getEnvironment: state => state.clientConfig?.environment,
  getMode: state => state.clientConfig?.mode,
  getTagline: state => state.tagline,
  getVersion: state => state.version,
  getConfigurationType: state => state.clientConfig?.store?.type,
  featureFlags: state => ([]),

  getMulticlusterStatus: (state, getters) => {
    // is Kuma running in Multi-Zone mode?

    let status

    if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_FAKE_MULTIZONE === 'true') {
      status = true

      console.warn(
        '%c ✨You are currently faking Multi-Zone mode.',
        'background: black; color: white; display: block; padding: 0.25rem;',
      )
    } else {
      status = getters.getMode === 'global'
    }

    return status
  },
}

const actions: ActionTree<ConfigInterface, RootInterface> = {
  bootstrapConfig({ dispatch }) {
    const infoPromise = dispatch('getInfo')
    const configPromise = dispatch('getConfig')

    return Promise.all([infoPromise, configPromise])
  },
  // get the general Kuma config (this differs from the API config endpoint)
  getConfig({ commit }) {
    return Kuma.getConfig().then(response => {
      commit('SET_CONFIG_DATA', response)
    })
  },

  // get the status of the API
  getStatus({ commit }) {
    return Kuma.getStatus().then(response => {
      commit('SET_STATUS', response)
    })
  },

  // get the current tagline and version
  getInfo({ commit }) {
    return Kuma.getInfo()
      .then(response => {
        commit('SET_TAGLINE', response.tagline)
        commit('SET_VERSION', response.version)
      })
      .catch(error => {
        console.error(error)
      })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
