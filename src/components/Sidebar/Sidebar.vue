<template>
  <KNav :is-collapsed="isCollapsed">
    <div
      slot="NavMenu"
      :class="{'is-hovering': hovering}"
      class="menu-container"
    >
      <SidebarMenu
        v-for="(menu, i) in menuList.sections"
        :key="i"
        :menu="menu"
        :trigger-hovering="isHovering"
        :index="i"
        :is-last="i === lastMenuList"
      />
      <CollapseToggle
        :handle-toggle-collapse="handleToggleCollapse"
      />
    </div>
  </KNav>
</template>

<script>
import KNav from './KNav'
import SidebarMenu from './SidebarMenu'
import CollapseToggle from './CollapseToggle'

import { getItemFromStorage, setItemToStorage } from '@/Cache'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    KNav,
    SidebarMenu,
    CollapseToggle
  },

  data () {
    return {
      isCollapsed: false,
      sidebarSavedState: null,
      toggleWorkspaces: false,
      hovering: false
    }
  },

  computed: {
    ...mapState('auth', {
      perms: state => state.permissions
    }),

    ...mapState('workspaces', {
      workspace: state => state.workspace,
      workspaces: state => state.workspaces
    }),

    ...mapState('sidebar', {
      menu: state => state.menu
    }),

    workspaceList () {
      return this.workspaces
    },

    currentWorkspace () {
      return this.workspaceList.filter(w => w.name === this.workspace)[0]
    },

    portalIsLegacy () {
      return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal_is_legacy')
    },

    portalIsEnabled () {
      return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal')
    },

    /**
     * Main property for items in the sidebar menu. Filters out menu.js items by
     * RBAC permissions and fetches Kong Admin Plugin routes
     * @returns {{sections:Array<MenuItem>}}
     */
    menuList () {
      // get routes allowed by rbac
      // const routes = this.$rbac.filterRoutes(this.perms, this.$router.allRoutes,
      //   this.currentWorkspace && this.currentWorkspace.name)

      // const routes = this.$router.allRoutes

      const filteredMenu = JSON.parse(JSON.stringify(this.menu))

      return filteredMenu
    },

    lastMenuList () {
      return Object.keys(this.menuList.sections).length - 1
    }
  },

  mounted () {
    const sidebarState = getItemFromStorage('sidebarCollapsed')

    if (document.documentElement.clientWidth <= 900) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = sidebarState || false
    }

    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    ...mapMutations('sidebar', [
      'setMenu'
    ]),

    handleToggleCollapse () {
      this.isCollapsed = !this.isCollapsed
      this.setCollapsedState(this.isCollapsed)
    },

    isHovering (a) {
      this.hovering = a
    },

    setCollapsedState (collapsedState) {
      setItemToStorage('sidebarCollapsed', collapsedState)
    },

    handleResize () {
      const sidebarState = getItemFromStorage('sidebarCollapsed')

      if (document.documentElement.clientWidth <= 900) {
        this.isCollapsed = sidebarState || true
      }

      if (document.documentElement.clientWidth >= 900) {
        this.isCollapsed = sidebarState || false
      }
    },

    openWorkspaces () {
      this.toggleWorkspaces = !this.toggleWorkspaces
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: calc(100vh - var(--topbar-height));
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding: 32px;
  font-size: var(--type-md);
}

.sidebar__title {
  font-size: var(--type-xs);
  font-weight: normal;
  text-transform: uppercase;
  margin: 24px 0 10px 0;
}

.main-nav {
}

.main-nav a {
  display: block;
  /* padding: 0 32px; */
  color: var(--black-1);
  line-height: 38px;
}

.main-nav .router-link-active {
  background: rgba(61, 136, 242, 0.07);
  box-shadow: inset -2px 0 0 0 rgba(61, 136, 242, 0.75);
  margin: 0 -32px;
  padding-left: 32px;
  padding-right: 32px;
}

.main-nav__group {

}
</style>
