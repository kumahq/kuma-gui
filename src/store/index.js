import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from '@/store/getters'
import sidebar from '@/store/modules/sidebar'
import workspaces from '@/store/modules/workspaces'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sidebar,
    workspaces
  },
  state: {},
  getters,
  mutations: {},
  actions: {}
})
