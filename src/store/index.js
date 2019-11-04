import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from '@/store/getters'
import sidebar from '@/store/modules/sidebar'
import workspaces from '@/store/modules/workspaces'
import Actions from '@/store/actions'

Vue.use(Vuex)

export default (api) => {
  const store = new Vuex.Store({
    modules: {
      sidebar,
      workspaces
    },
    state: {
      selectedMesh: 'default'
    },
    getters,
    mutations: {},
    actions: Actions(api)
  })

  return store
}
