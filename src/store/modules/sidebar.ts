import menu from '@/components/Sidebar/menu'

type Menu = typeof menu
export interface SidebarState {
  menu: Menu
}

const state = { menu }

export default {
  namespaced: true,
  state,
}
