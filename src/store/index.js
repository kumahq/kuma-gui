import Vue from 'vue'
import Vuex from 'vuex'

import sidebar from '@/store/modules/sidebar'
import workspaces from '@/store/modules/workspaces'

Vue.use(Vuex)

export default (api) => {
  const store = new Vuex.Store({
    modules: {
      sidebar,
      workspaces
    },
    state: {
      meshes: [],
      dataplanes: [],
      selectedMesh: 'default',
      onboardingFinished: null
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

      // fetch all dataplanes from a mesh
      fetchDataplanesFromMesh ({ commit }) {
        return api.getAllDataplanesFromMesh()
          .then(() => {
            commit('FETCH_DATAPLANES_FROM_MESH')
          })
          .catch(error => {
            console.error(error)
          })
      },

      // update the selected mesh
      updateSelectedMesh ({ commit }, mesh) {
        commit('SET_SELECTED_MESH', mesh)
        console.log(mesh)
      }
    }
  })

  return store
}
