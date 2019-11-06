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
      selectedMesh: 'default',
      onboardingFinished: null
    },
    getters: {
      getSelectedMesh () {
        return state.selectedMesh
      },
      getMeshList () {
        return state.meshes
      }
    },
    mutations: {
      FETCH_MESHES (state, meshes) {
        state.meshes = meshes
      }
    },
    actions: {
      fetchMeshList ({ commit }) {
        return api.getAllMeshes()
          .then(response => {
            commit('FETCH_MESHES', response)
          })
      }
    }
  })

  return store
}
