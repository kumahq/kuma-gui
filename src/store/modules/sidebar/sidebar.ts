import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { State } from '../../index'
import { calculateMeshInsights, calculateGlobalInsights } from './utils'
import { SidebarInterface } from './sidebar.types'

import Kuma from '@/services/kuma'
import { MeshInsight } from '@/types'

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

const getters: GetterTree<SidebarInterface, State> = {}

const actions: ActionTree<SidebarInterface, State> = {
  getInsights({ dispatch }) {
    return Promise.all([dispatch('getGlobalInsights'), dispatch('getMeshInsights')])
  },

  async getMeshInsights({ commit, rootState }) {
    if (rootState.selectedMesh === null) {
      return
    }

    let meshInsightsRawData: { items: MeshInsight[], total: number }
    let meshInsights

    try {
      const response = await Kuma.getMeshInsights({ name: rootState.selectedMesh })
      meshInsightsRawData = { items: [response], total: 1 }

      meshInsights = calculateMeshInsights(meshInsightsRawData)
    } catch {
      meshInsights = []
    }

    commit('SET_MESH_INSIGHTS', meshInsights)
  },

  async getGlobalInsights({ commit }) {
    const globalInsightsRawData = await Kuma.getGlobalInsights()

    const globalInsights = calculateGlobalInsights(globalInsightsRawData)

    commit('SET_GLOBAL_INSIGHTS', globalInsights)
  },
}

const sidebarModule = {
  namespaced: true,
  state: initialSidebarState,
  getters,
  mutations,
  actions,
}

export default sidebarModule
