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
      totalDataplaneCountFromMesh: 0
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
      getTotalDataplaneCountFromMesh (state) {
        return state.totalDataplaneCountFromMesh
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
      SET_TOTAL_DP_COUNT_FROM_MESH (state, count) {
        state.totalDataplaneCountFromMesh = count
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
      }
    }
  })

  return store
}
