import menu from '@/components/Sidebar/menu'

type Menu = typeof menu
export interface SidebarState {
  menu: typeof menu
}

const state = { menu }

const mutations = {
  setMenu (state: SidebarState, menu: Menu) {
    state.menu = menu
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
