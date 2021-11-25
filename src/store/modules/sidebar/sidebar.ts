import Kuma from '@/services/kuma'
import { MeshInsight } from '@/types'
import { fetchAllResources } from '@/helpers'

import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '../..'
import { calculateMeshInsights } from './utils'
import { SidebarInterface } from './sidebar.types'

const state: SidebarInterface = {
  insights: {
    global: {
      meshes: 0,
      zoneCps: 0,
      zoneIngresses: 0,
    },
    mesh: {
      services: {
        internal: 0,
        external: 0,
      },
      dataplanes: {
        total: 0,
        standard: 0,
        gateway: 0,
      },
      policies: {
        CircuitBreaker: 0,
        FaultInjection: 0,
        HealthCheck: 0,
        ProxyTemplate: 0,
        TrafficLog: 0,
        TrafficPermission: 0,
        TrafficRoute: 0,
        TrafficTrace: 0,
        RateLimit: 0,
        Retry: 0,
        Timeout: 0,
      },
    },
  },
}
const mutations: MutationTree<SidebarInterface> = {
  SET_GLOBAL_INSIGHTS: (state, globalInsights) => (state.insights.global = globalInsights),
  SET_MESH_INSIGHTS: (state, meshInsight) => (state.insights.mesh = meshInsight),
}

const getters: GetterTree<SidebarInterface, RootInterface> = {}

const actions: ActionTree<SidebarInterface, RootInterface> = {
  getInsights({ dispatch }) {
    return Promise.all([dispatch('getGlobalInsights'), dispatch('getMeshInsights')])
  },

  async getMeshInsights({ commit, rootState }) {
    const selectedMesh = rootState.selectedMesh

    let meshInsightsRawData: { items: MeshInsight[]; total: number }
    let meshInsights

    try {
      if (selectedMesh === 'all') {
        const params = {
          callEndpoint: Kuma.getAllMeshInsights.bind(Kuma),
        }

        meshInsightsRawData = await fetchAllResources<MeshInsight>(params)
      } else {
        meshInsightsRawData = { items: [await Kuma.getMeshInsights({ name: selectedMesh })], total: 1 }
      }

      meshInsights = calculateMeshInsights(meshInsightsRawData)
      console.log({ meshInsights, meshInsightsRawData })
    } catch {
      meshInsights = []
    }

    commit('SET_MESH_INSIGHTS', meshInsights)
  },

  async getGlobalInsights({ commit }) {
    const globalInsightsRawData = await Kuma.getGlobalInsights()

    const globalInsights = {
      meshes: globalInsightsRawData.resources.Mesh.total,
      zones: globalInsightsRawData.resources.Zone.total,
      zoneIngresses: globalInsightsRawData.resources.ZoneIngress.total,
    }

    commit('SET_GLOBAL_INSIGHTS', globalInsights)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
