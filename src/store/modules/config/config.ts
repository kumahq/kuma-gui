import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { State } from '../../index'
import { ConfigInterface, ClientConfigInterface } from './config.types'
import { kumaApi } from '@/api/kumaApi'

const initialConfigState: ConfigInterface = {
  status: null,
  tagline: null,
  version: null,
  kumaDocsVersion: 'latest',
  clientConfig: null,
}

const mutations: MutationTree<ConfigInterface> = {
  SET_CONFIG_DATA: (state, config: ClientConfigInterface) => (state.clientConfig = config),
  SET_STATUS: (state, status: 'OK' | null) => (state.status = status),
  SET_TAGLINE: (state, tagline: string) => (state.tagline = tagline),
  SET_VERSION: (state, version: string) => (state.version = version),
  SET_KUMA_DOCS_VERSION: (state, kumaDocsVersion: string) => (state.kumaDocsVersion = kumaDocsVersion),
}

const getters: GetterTree<ConfigInterface, State> = {
  getStatus: state => state.status,
  getConfig: state => state.clientConfig,
  getEnvironment: state => state.clientConfig?.environment,
  getMode: state => state.clientConfig?.mode,
  getTagline: state => state.tagline,
  getVersion: state => state.version,
  getKumaDocsVersion: state => state.kumaDocsVersion,
  getConfigurationType: state => state.clientConfig?.store?.type,

  getMulticlusterStatus: (_state, getters) => {
    // is Kuma running in Multi-Zone mode?

    let status

    if (import.meta.env.DEV && import.meta.env.VITE_FAKE_MULTIZONE === 'true') {
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

const actions: ActionTree<ConfigInterface, State> = {
  bootstrapConfig({ dispatch }) {
    const infoPromise = dispatch('getInfo')
    const configPromise = dispatch('getConfig')

    return Promise.all([infoPromise, configPromise])
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

  // get the current tagline and version
  getInfo({ commit }) {
    return kumaApi.getInfo()
      .then((response) => {
        commit('SET_TAGLINE', response.tagline)
        commit('SET_VERSION', response.version)

        let kumaDocsVersion: string
        const version = response.basedOnKuma ?? response.version
        const suffixIndex = version.indexOf('-preview.')
        if (suffixIndex !== -1) {
          const basedOnKumaStripped = version.substring(0, suffixIndex)

          kumaDocsVersion = basedOnKumaStripped === '0.0.0' ? 'dev' : basedOnKumaStripped.replace(/\.\d+$/, '.x')
        } else {
          // Replaces the patch version number with `x` because that’s the URL path segment used on the documentation website.
          kumaDocsVersion = version.replace(/\.\d+$/, '.x')
        }

        commit('SET_KUMA_DOCS_VERSION', kumaDocsVersion)
      })
      .catch(error => {
        console.error(error)
      })
  },
}

const configModule = {
  namespaced: true,
  state: initialConfigState,
  getters,
  mutations,
  actions,
}

export default configModule
