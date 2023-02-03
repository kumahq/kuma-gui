import { ActionTree, MutationTree } from 'vuex'

import { calculateMeshInsights, calculateGlobalInsights } from './utils'
import { SidebarInterface } from './sidebar.types'
import type { State } from '../../storeConfig'
import type KumaApi from '@/services/kuma-api/KumaApi'

const initialSidebarState: SidebarInterface = {
  insights: {
    global: {},
    mesh: {
      services: {
        total: 0,
        internal: 0,
        external: 0,
      },
      dataplanes: {
        total: 0,
        standard: 0,
        gateway: 0,
      },
      policies: {},
    },
  },
}

const mutations: MutationTree<SidebarInterface> = {
  SET_GLOBAL_INSIGHTS: (state, globalInsights) => (state.insights.global = globalInsights),
  SET_MESH_INSIGHTS: (state, meshInsight) => (state.insights.mesh = meshInsight),
}

const actions = (kumaApi: KumaApi): ActionTree<SidebarInterface, State> => ({
  getInsights({ dispatch }) {
    return Promise.all([dispatch('getGlobalInsights'), dispatch('getMeshInsights')])
  },

  async getMeshInsights({ commit, rootState }) {
    if (rootState.selectedMesh === null) {
      return
    }

    let meshInsights

    try {
      const response = await kumaApi.getMeshInsights({ name: rootState.selectedMesh })

      meshInsights = calculateMeshInsights({ items: [response] })
    } catch {
      meshInsights = calculateMeshInsights({ items: [] })
    }

    commit('SET_MESH_INSIGHTS', meshInsights)
  },

  async getGlobalInsights({ commit }) {
    const globalInsightsRawData = await kumaApi.getGlobalInsights()

    const globalInsights = calculateGlobalInsights(globalInsightsRawData)

    commit('SET_GLOBAL_INSIGHTS', globalInsights)
  },
})

export default (kumaApi: KumaApi) => {
  return {
    namespaced: true,
    state: () => initialSidebarState,
    mutations,
    actions: actions(kumaApi),
  }
}
