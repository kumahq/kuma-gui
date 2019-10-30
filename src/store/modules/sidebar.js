import menu from '@/components/Sidebar/menu'

const state = { menu }

const mutations = {
  setMenu (state, menu) {
    state.menu = menu
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
