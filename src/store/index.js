import Vue from 'vue'
import Vuex from 'vuex'

import sidebar from '@/store/modules/sidebar'
// import workspaces from '@/store/modules/workspaces'

Vue.use(Vuex)

export default (api) => {
  const store = new Vuex.Store({
    modules: {
      sidebar
      // workspaces
    },
    state: {
      onboardingComplete: false,
      globalLoading: null,
      meshes: [],
      dataplanes: [],
      selectedMesh: 'default',
      totalMeshCount: 0,
      totalDataplaneCount: 0,
      totalDataplaneList: [],
      totalDataplaneCountFromMesh: 0,
      totalTrafficRoutesCountFromMesh: 0,
      totalTrafficPermissionsCountFromMesh: 0,
      totalTrafficLogsCountFromMesh: 0,
      tagline: null,
      version: null,
      status: null
    },
    getters: {
      getOnboardingStatus (state) {
        return state.onboardingComplete
      },
      globalLoading (state) {
        return state.globalLoading
      },
      getSelectedMesh (state) {
        return state.selectedMesh
      },
      getMeshList (state) {
        return state.meshes
      },
      getDataplanes (state) {
        return state.dataplanes
      },
      getDataplanesList (state) {
        return state.totalDataplaneList
      },
      getTotalMeshCount (state) {
        return state.totalMeshCount
      },
      getTotalDataplaneCount (state) {
        return state.totalDataplaneCount
      },
      getTotalDataplaneCountFromMesh (state) {
        return state.totalDataplaneCountFromMesh
      },
      getTotalTrafficRoutesCountFromMesh (state) {
        return state.totalTrafficRoutesCountFromMesh
      },
      getTotalTrafficPermissionsCountFromMesh (state) {
        return state.totalTrafficPermissionsCountFromMesh
      },
      getTrafficLogsFromMeshTotalCount (state) {
        return state.totalTrafficLogsCountFromMesh
      },
      getVersion (state) {
        return state.version
      },
      getTagline (state) {
        return state.tagline
      },
      getStatus (state) {
        return state.status
      }
    },
    mutations: {
      SET_ONBOARDING_STATUS (state, status) {
        state.onboardingComplete = status
      },
      SET_GLOBAL_LOADING (state, { globalLoading }) {
        state.globalLoading = globalLoading
      },
      FETCH_ALL_MESHES (state, meshes) {
        state.meshes = meshes
      },
      FETCH_DATAPLANES_FROM_MESH (state, dataplanes) {
        state.dataplanes = dataplanes
      },
      SET_SELECTED_MESH (state, mesh) {
        state.selectedMesh = mesh
      },
      SET_TOTAL_MESH_COUNT (state, count) {
        state.totalMeshCount = count
      },
      SET_TOTAL_DP_COUNT (state, count) {
        state.totalDataplaneCount = count
      },
      SET_TOTAL_DP_LIST (state, dataplanes) {
        state.totalDataplaneList = dataplanes
      },
      SET_TOTAL_DP_COUNT_FROM_MESH (state, count) {
        state.totalDataplaneCountFromMesh = count
      },
      SET_TOTAL_TRAFFIC_ROUTES_COUNT_FROM_MESH (state, count) {
        state.totalTrafficRoutesCountFromMesh = count
      },
      SET_TOTAL_TRAFFIC_PERMISSIONS_COUNT_FROM_MESH (state, count) {
        state.totalTrafficPermissionsCountFromMesh = count
      },
      SET_TOTAL_TRAFFIC_LOGS_COUNT_FROM_MESH (state, count) {
        state.totalTrafficLogsCountFromMesh = count
      },
      SET_VERSION (state, version) {
        state.version = version
      },
      SET_TAGLINE (state, tagline) {
        state.tagline = tagline
      },
      SET_STATUS (state, status) {
        state.status = status
      }
    },
    actions: {
      // update the onboarding state
      updateOnboardingStatus ({ commit }, status) {
        commit('SET_ONBOARDING_STATUS', status)
      },

      // fetch all of the meshes from the API
      fetchMeshList ({ commit }) {
        return api.getAllMeshes()
          .then(response => {
            commit('FETCH_ALL_MESHES', response)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // fetch all dataplanes from a specific mesh
      fetchDataplanesFromMesh ({ commit }, mesh) {
        return api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            commit('FETCH_DATAPLANES_FROM_MESH', response)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // update the selected mesh
      updateSelectedMesh ({ commit }, mesh) {
        commit('SET_SELECTED_MESH', mesh)
      },

      // get the total number of meshes
      getMeshTotalCount ({ commit }) {
        return api.getAllMeshes()
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_MESH_COUNT', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // a makeshift way to get the total amount of dataplanes present
      getDataplaneTotalCount ({ commit }) {
        const getDataplanes = async () => {
          const meshes = await api.getAllMeshes()
          const result = []

          for (let i = 0; i < meshes.items.length; i++) {
            const dataplanes = await api.getAllDataplanesFromMesh(meshes.items[i].name)
            const dpCount = await dataplanes.items.length

            result.push(dpCount)
          }

          const reduced = result.reduce((a, b) => a + b, 0)

          commit('SET_TOTAL_DP_COUNT', reduced)
        }

        getDataplanes()
      },

      // a makeshift way to get the list of all present dataplanes across all meshes
      getAllDataplanes ({ commit }) {
        const getDataplanes = async () => {
          return new Promise(async (resolve, reject) => {
            const meshes = await api.getAllMeshes()
            const result = []

            for (let i = 0; i < meshes.items.length; i++) {
              const mesh = meshes.items[i].name
              const dataplanes = await api.getAllDataplanesFromMesh(mesh)
              const items = await dataplanes.items

              for (let i = 0; i < items.length; i++) {
                const itemName = items[i].name
                const itemMesh = items[i].mesh
                const itemStatus = await api.getDataplaneOverviews(mesh, itemName)
                  .then(response => {
                    const items = response.dataplaneInsight.subscriptions

                    for (let i = 0; i < items.length; i++) {
                      const connectTime = items[i].connectTime
                      const disconnectTime = items[i].disconnectTime

                      if (connectTime && connectTime.length && !disconnectTime) {
                        return 'Online'
                      } else {
                        return 'Offline'
                      }
                    }
                  })

                result.push({
                  status: itemStatus,
                  name: itemName,
                  mesh: itemMesh
                })
              }
            }

            commit('SET_TOTAL_DP_LIST', result)
            resolve()
          })
        }

        return getDataplanes()
      },

      // get the total number of dataplanes from a mesh
      getDataplaneFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_DP_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic routes from a mesh
      getTrafficRoutesFromMeshTotalCount ({ commit }, mesh) {
        return api.getTrafficRoutes(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_ROUTES_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic permissions from a mesh
      getTrafficPermissionsFromMeshTotalCount ({ commit }, mesh) {
        return api.getTrafficPermissions(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_PERMISSIONS_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic logs from a mesh
      getTrafficLogsFromMeshTotalCount ({ commit }, mesh) {
        return api.getTrafficLogs(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_LOGS_COUNT_FROM_MESH', total)
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

      // get the status of the API
      getStatus ({ commit }) {
        return api.getStatus()
          .then(response => {
            commit('SET_STATUS', response.statusText)
          })
      }
    }
  })

  return store
}
