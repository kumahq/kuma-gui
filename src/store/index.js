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
      meshes: [],
      dataplanes: [],
      selectedMesh: 'default',
      onboardingFinished: null,
      totalMeshCount: 0,
      totalDataplaneCount: 0,
      totalDataplaneCountFromMesh: 0,
      tagline: null,
      version: null
    },
    getters: {
      getSelectedMesh (state) {
        return state.selectedMesh
      },
      getMeshList (state) {
        return state.meshes
      },
      getDataplanes (state) {
        return state.dataplanes
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
      getVersion (state) {
        return state.version
      },
      getTagline (state) {
        return state.tagline
      }
    },
    mutations: {
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
      SET_TOTAL_DP_COUNT_FROM_MESH (state, count) {
        state.totalDataplaneCountFromMesh = count
      },
      SET_VERSION (state, version) {
        state.version = version
      },
      SET_TAGLINE (state, tagline) {
        state.tagline = tagline
      }
    },
    actions: {
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

      // get the total number of dataplanes from a mesh
      getDataplanFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_DP_COUNT_FROM_MESH', total)
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
      }
    }
  })

  return store
}
